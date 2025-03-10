const customerService = require("../services/customerService");
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
  // static async getAttributes(req, res, next) {
  //   try {
  //     const attributes = await customerService.getAttributes();
  //     customerController.handleResponse(
  //       res,
  //       200,
  //       "Attributes fetched successfully",
  //       attributes
  //     );
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  static async getAttributes(req, res, next) {
    try {
      const user_id = req.user.user_id; // Extract user_id from token
      if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const attributes = await customerService.getAttributes(user_id);
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
      const { user_id } = req.user; // Extract user_id from token

      if (!contact_field_id) {
        return res
          .status(400)
          .json({ message: "contact_field_id is required" });
      }

      if (!user_id) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      const result = await customerService.deleteAttribute(
        contact_field_id,
        user_id
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Attribute not found or unauthorized" });
      }

      return res
        .status(200)
        .json({ message: "Attribute deleted successfully" });
    } catch (error) {
      console.error("Error deleting attribute:", error.message);
      next(error);
    }
  }

  // static async importCsv(req, res) {
  //   try {
  //     const { user_id } = req.user; // Extract user_id from token
  //     console.log("Received file:", req.file);

  //     // ✅ Validate file upload
  //     if (!req.file) {
  //       return res.status(400).json({ message: "Please upload a CSV file." });
  //     }

  //     // ✅ Remove BOM and convert file to string
  //     const fileBuffer = req.file.buffer
  //       .toString("utf-8")
  //       .replace(/^\uFEFF/, "");
  //     const fileStream = fileBuffer
  //       .split("\n")
  //       .map((line) => line.trim())
  //       .filter((line) => line);

  //     // ✅ Ensure file is not empty
  //     if (fileStream.length === 0) {
  //       return res.status(400).json({ message: "Uploaded CSV file is empty." });
  //     }

  //     // ✅ Extract and normalize headers from CSV
  //     const csvHeaders = fileStream[0]
  //       .split(",")
  //       .map((header) => header.trim().toLowerCase().replace(/\s+/g, "_")); // Normalize headers
  //     console.log("Extracted CSV Headers:", csvHeaders);

  //     // ✅ Fetch existing headers from `customer_details`
  //     const [dbFields] = await pool.query(
  //       `SELECT contact_field_id, field_name FROM CCMS.customer_details WHERE user_id = ?`,
  //       [user_id]
  //     );

  //     // ✅ Normalize database headers for comparison
  //     const fieldMap = {};
  //     dbFields.forEach((field) => {
  //       fieldMap[field.field_name.toLowerCase().replace(/\s+/g, "_")] =
  //         field.contact_field_id;
  //     });

  //     const dbHeaders = Object.keys(fieldMap);
  //     console.log("Database Headers:", dbHeaders);

  //     // ✅ Check if all CSV headers exist in the database & vice versa
  //     const missingInDatabase = csvHeaders.filter(
  //       (header) => !fieldMap[header]
  //     );
  //     const missingInCSV = dbHeaders.filter(
  //       (header) => !csvHeaders.includes(header)
  //     );

  //     if (missingInDatabase.length > 0 || missingInCSV.length > 0) {
  //       return res.status(400).json({
  //         message: `Header mismatch!`,
  //         missing_in_database:
  //           missingInDatabase.length > 0 ? missingInDatabase : "None",
  //         missing_in_csv: missingInCSV.length > 0 ? missingInCSV : "None",
  //       });
  //     }

  //     // ✅ Prepare SQL query
  //     const insertQuery = `
  //           INSERT INTO CCMS.customer_data (user_id, contact_field_id, field_value, status, created_on)
  //           VALUES (?, ?, ?, ?, NOW())
  //       `;

  //     // ✅ Use `for...of` to handle async database inserts properly
  //     for (const line of fileStream.slice(1)) {
  //       const values = line.split(",");

  //       if (values.length !== csvHeaders.length) {
  //         return res
  //           .status(400)
  //           .json({ message: "CSV file format is incorrect." });
  //       }

  //       for (let i = 0; i < csvHeaders.length; i++) {
  //         const contact_field_id = fieldMap[csvHeaders[i]];
  //         const field_value = values[i];

  //         await pool.query(insertQuery, [
  //           user_id,
  //           contact_field_id,
  //           field_value,
  //           1,
  //         ]);
  //       }
  //     }

  //     // ✅ Send success response only once
  //     return res
  //       .status(200)
  //       .json({ message: "CSV data imported successfully!" });
  //   } catch (error) {
  //     console.error("Error importing CSV:", error.message);
  //     return res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }
  static async importCsv(req, res) {
    try {
      const { user_id } = req.user; // Extract user_id from token
      console.log("Received file:", req.file);

      // ✅ Validate file upload
      if (!req.file) {
        return res.status(400).json({ message: "Please upload a CSV file." });
      }

      // ✅ Convert file buffer to string and remove BOM
      const fileBuffer = req.file.buffer
        .toString("utf-8")
        .replace(/^\uFEFF/, "");
      const fileStream = fileBuffer
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);

      // ✅ Ensure file is not empty
      if (fileStream.length < 2) {
        return res.status(400).json({ message: "Uploaded CSV file is empty." });
      }

      // ✅ Extract and normalize headers
      const csvHeaders = fileStream[0]
        .split(",")
        .map((header) => header.trim().toLowerCase().replace(/\s+/g, "_"));
      console.log("Extracted CSV Headers:", csvHeaders);

      // ✅ Fetch the latest `row_number` for this user
      const [lastRow] = await pool.query(
        `SELECT MAX(row_number) AS last_row_no FROM CCMS.customer_data WHERE user_id = ?`,
        [user_id]
      );
      let row_number = lastRow?.[0]?.last_row_no
        ? lastRow[0].last_row_no + 1
        : 1; // Start from 1 if no previous rows

      // ✅ Fetch existing headers from `customer_details`
      const [dbFields] = await pool.query(
        `SELECT contact_field_id, field_name FROM CCMS.customer_details WHERE user_id = ?`,
        [user_id]
      );

      // ✅ Map database headers for validation
      const fieldMap = {};
      dbFields.forEach((field) => {
        fieldMap[field.field_name.toLowerCase().replace(/\s+/g, "_")] =
          field.contact_field_id;
      });

      const dbHeaders = Object.keys(fieldMap);
      console.log("Database Headers:", dbHeaders);

      // ✅ Check if all CSV headers exist in the database
      const missingInDatabase = csvHeaders.filter(
        (header) => !fieldMap[header]
      );
      const missingInCSV = dbHeaders.filter(
        (header) => !csvHeaders.includes(header)
      );

      if (missingInDatabase.length > 0 || missingInCSV.length > 0) {
        return res.status(400).json({
          message: `Header mismatch!`,
          missing_in_database:
            missingInDatabase.length > 0 ? missingInDatabase : "None",
          missing_in_csv: missingInCSV.length > 0 ? missingInCSV : "None",
        });
      }

      // ✅ Prepare SQL query for inserting data (using `row_number` instead of `row_no`)
      const insertQuery = `
            INSERT INTO CCMS.customer_data (user_id, row_number, contact_field_id, field_value, status, created_on)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;

      // ✅ Insert each row with dynamic row_number
      for (const line of fileStream.slice(1)) {
        const values = line.split(",");

        if (values.length !== csvHeaders.length) {
          return res
            .status(400)
            .json({ message: "CSV file format is incorrect." });
        }

        for (let i = 0; i < csvHeaders.length; i++) {
          const contact_field_id = fieldMap[csvHeaders[i]];
          const field_value = values[i];

          await pool.query(insertQuery, [
            user_id,
            row_number,
            contact_field_id,
            field_value,
            1,
          ]);
        }

        row_number++; // Increment row_number for the next row
      }

      // ✅ Send success response
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
