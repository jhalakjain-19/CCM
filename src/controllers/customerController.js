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
      console.log("received file", req.file);
      // Validate file upload
      if (!req.file) {
        return res.status(400).json({ message: "Please upload a CSV file." });
      }

      // Read file buffer and convert to a stream
      const fileBuffer = req.file.buffer;
      const fileStream = fileBuffer.toString("utf-8").split("\n");

      if (fileStream.length === 0) {
        return res.status(400).json({ message: "Uploaded CSV file is empty." });
      }

      const results = [];
      const headers = fileStream[0].trim().split(","); // Extract headers from the first row

      // Fetch existing headers from `customer_details`
      const [dbFields] = await pool.query(
        `SELECT contact_field_id, field_name FROM CCMS.customer_details WHERE user_id = ?`,
        [user_id]
      );

      // Convert database headers into an object for easy lookup
      const fieldMap = {};
      dbFields.forEach((field) => {
        fieldMap[field.field_name.toLowerCase()] = field.contact_field_id;
      });

      // Check if all CSV headers exist in the database
      const missingHeaders = headers.filter(
        (header) => !fieldMap[header.toLowerCase()]
      );
      if (missingHeaders.length > 0) {
        return res.status(400).json({
          message: `Missing headers in database: ${missingHeaders.join(", ")}`,
        });
      }

      // Parse CSV rows
      const insertQuery = `INSERT INTO CCMS.customer_data (user_id, contact_field_id, field_value, status, created_on) VALUES (?, ?, ?, ?, NOW())`;

      fileStream.slice(1).forEach(async (line) => {
        const values = line.trim().split(",");

        if (values.length !== headers.length) {
          return res
            .status(400)
            .json({ message: "CSV file format is incorrect." });
        }

        for (let i = 0; i < headers.length; i++) {
          const contact_field_id = fieldMap[headers[i].toLowerCase()];
          const field_value = values[i];

          await pool.query(insertQuery, [
            user_id,
            contact_field_id,
            field_value,
            1,
          ]);
        }
      });

      res.status(200).json({ message: "CSV data imported successfully!" });
    } catch (error) {
      console.error("Error importing CSV:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
module.exports = customerController;
