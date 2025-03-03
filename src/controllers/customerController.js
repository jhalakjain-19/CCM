const customerService = require("../services/customerService");
const xlsx = require("xlsx");
const pool = require("../config/db");
class customerController {
  static handleResponse(res, status, message, data = null) {
    console.log(status);

    res.status(status).json({
      status,
      message,
      data,
    });
  }
  static async getAttrTypes(req, res, next) {
    try {
      const attrTypes = await customerService.getAttrTypes();
      customerController.handleResponse(
        res,
        200,
        "Attribute types fetched successfully",
        attrTypes
      );
    } catch (error) {
      next(error);
    }
  }
  static async getDataTypes(req, res, next) {
    try {
      const dataTypes = await customerService.getDataTypes();
      customerController.handleResponse(
        res,
        200,
        "Data types fetched successfully",
        dataTypes
      );
    } catch (error) {
      next(error);
    }
  }
  static async createAttribute(req, res, next) {
    try {
      const newAttribute = await customerService.createAttribute(req);
      customerController.handleResponse(
        res,
        201,
        "Attribute created successfully",
        newAttribute
      );
    } catch (error) {
      next(error);
    }
  }
  static async getAttributes(req, res, next) {
    try {
      const attributes = await customerService.getAttributes();
      customerController.handleResponse(
        res,
        200,
        "Attributes fetched successfully",
        attributes
      );
    } catch (error) {
      next(error);
    }
  }
  static async deleteAttribute(req, res, next) {
    try {
      const { contact_field_id } = req.params;

      if (!contact_field_id) {
        return res
          .status(400)
          .json({ message: "contact_field_id is required" });
      }

      const result = await customerService.deleteAttribute(contact_field_id);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Attribute not found" });
      }

      return res
        .status(200)
        .json({ message: "Attribute deleted successfully" });
    } catch (error) {
      console.error("Error deleting attribute:", error.message);
      next(error);
    }
  }

  static async importCsv(req, res) {
    try {
      const { id: user_id } = req.user; // Extract user_id from token

      console.log("Received file:", req.file);

      // ✅ Validate file upload
      if (!req.file) {
        return res.status(400).json({ message: "Please upload a CSV file." });
      }

      // ✅ Remove BOM and convert file to string
      const fileBuffer = req.file.buffer
        .toString("utf-8")
        .replace(/^\uFEFF/, "");
      const fileStream = fileBuffer
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);

      // ✅ Ensure file is not empty
      if (fileStream.length === 0) {
        return res.status(400).json({ message: "Uploaded CSV file is empty." });
      }

      // ✅ Extract and normalize headers
      const headers = fileStream[0]
        .split(",")
        .map((header) => header.trim().toLowerCase().replace(/\s+/g, "_")); // Normalize headers

      console.log("Extracted Headers:", headers);

      // ✅ Fetch existing headers from `customer_details`
      const [dbFields] = await pool.query(
        `SELECT contact_field_id, field_name FROM CCMS.customer_details WHERE user_id = ?`,
        [user_id]
      );

      // ✅ Normalize database headers for comparison
      const fieldMap = {};
      dbFields.forEach((field) => {
        fieldMap[field.field_name.toLowerCase().replace(/\s+/g, "_")] =
          field.contact_field_id;
      });

      console.log("Database Fields:", Object.keys(fieldMap));

      // ✅ Check if all CSV headers exist in the database
      const missingHeaders = headers.filter((header) => !fieldMap[header]);
      if (missingHeaders.length > 0) {
        return res.status(400).json({
          message: `Missing headers in database: ${missingHeaders.join(", ")}`,
        });
      }

      // ✅ Prepare SQL query
      const insertQuery = `
            INSERT INTO CCMS.customer_data (user_id, contact_field_id, field_value, status, created_on)
            VALUES (?, ?, ?, ?, NOW())
        `;

      // ✅ Use `for...of` to handle async database inserts properly
      for (const line of fileStream.slice(1)) {
        const values = line.split(",");

        if (values.length !== headers.length) {
          return res
            .status(400)
            .json({ message: "CSV file format is incorrect." });
        }

        for (let i = 0; i < headers.length; i++) {
          const contact_field_id = fieldMap[headers[i]];
          const field_value = values[i];

          await pool.query(insertQuery, [
            user_id,
            contact_field_id,
            field_value,
            1,
          ]);
        }
      }

      // ✅ Send success response only once
      return res
        .status(200)
        .json({ message: "CSV data imported successfully!" });
    } catch (error) {
      console.error("Error importing CSV:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
module.exports = customerController;
