const customerService = require("../services/customerService");
const pool = require("../config/db");
const { json2csv } = require("json-2-csv");
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
  //     const { user_id } = req.user;
  //     console.log("Received file:", req.file);

  //     // ✅ Validate file upload
  //     if (!req.file) {
  //       return res.status(400).json({ message: "Please upload a CSV file." });
  //     }

  //     // ✅ Convert file buffer to string and remove BOM
  //     const fileBuffer = req.file.buffer
  //       .toString("utf-8")
  //       .replace(/^\uFEFF/, "");
  //     const fileStream = fileBuffer
  //       .split("\n")
  //       .map((line) => line.trim())
  //       .filter((line) => line);

  //     // ✅ Ensure file is not empty
  //     if (fileStream.length < 2) {
  //       return res.status(400).json({ message: "Uploaded CSV file is empty." });
  //     }

  //     // ✅ Extract and normalize headers
  //     const csvHeaders = fileStream[0]
  //       .split(",")
  //       .map((header) => header.trim().toLowerCase().replace(/\s+/g, "_"));
  //     console.log("Extracted CSV Headers:", csvHeaders);

  //     // ✅ Fetch existing headers from `customer_details`
  //     const [dbFields] = await pool.query(
  //       `SELECT contact_field_id, field_name FROM CCMS.customer_details WHERE user_id = ?`,
  //       [user_id]
  //     );

  //     // ✅ Map database headers for validation
  //     const fieldMap = {};
  //     dbFields.forEach((field) => {
  //       fieldMap[field.field_name.toLowerCase().replace(/\s+/g, "_")] =
  //         field.contact_field_id;
  //     });

  //     const dbHeaders = Object.keys(fieldMap);
  //     console.log("Database Headers:", dbHeaders);

  //     // ✅ Check if all CSV headers exist in the database
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

  //     // ✅ Prepare SQL queries
  //     const insertCustomerUserDataQuery = `
  //           INSERT INTO CCMS.customer_user_data (user_id, status, created_on) VALUES (?, ?, NOW())
  //       `;

  //     const insertCustomerDataQuery = `
  //           INSERT INTO CCMS.customer_data (user_id, customer_user_data_id, contact_field_id, field_value, status, created_on)
  //           VALUES (?, ?, ?, ?, ?, NOW())
  //       `;

  //     // ✅ Insert each row separately with a unique `customer_user_data_id`
  //     for (const line of fileStream.slice(1)) {
  //       const values = line.split(",");

  //       if (values.length !== csvHeaders.length) {
  //         return res
  //           .status(400)
  //           .json({ message: "CSV file format is incorrect." });
  //       }

  //       // Generate a new `customer_user_data_id` for each row
  //       const [result] = await pool.query(insertCustomerUserDataQuery, [
  //         user_id,
  //         1,
  //       ]);
  //       const customer_user_data_id = result.insertId;

  //       console.log(
  //         "Generated customer_user_data_id for row:",
  //         customer_user_data_id
  //       );

  //       for (let i = 0; i < csvHeaders.length; i++) {
  //         const contact_field_id = fieldMap[csvHeaders[i]];
  //         const field_value = values[i];

  //         await pool.query(insertCustomerDataQuery, [
  //           user_id,
  //           customer_user_data_id, // Unique ID per row
  //           contact_field_id,
  //           field_value,
  //           1,
  //         ]);
  //       }
  //     }

  //     return res
  //       .status(200)
  //       .json({ message: "CSV data imported successfully with unique IDs!" });
  //   } catch (error) {
  //     console.error("Error importing CSV:", error.message);
  //     return res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }
  static async importCsv(req, res) {
    try {
      const { user_id } = req.user;
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

      // ✅ Identify missing headers
      const missingInDatabase = csvHeaders.filter(
        (header) => !fieldMap[header]
      );
      const availableHeaders = csvHeaders.filter((header) => fieldMap[header]); // Only use available headers

      console.log("Missing in Database:", missingInDatabase);
      console.log("Available Headers:", availableHeaders);

      // ✅ Prepare SQL queries
      const insertCustomerUserDataQuery = `
            INSERT INTO CCMS.customer_user_data (user_id, status, created_on) VALUES (?, ?, NOW())
        `;

      const insertCustomerDataQuery = `
            INSERT INTO CCMS.customer_data (user_id, customer_user_data_id, contact_field_id, field_value, status, created_on)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;

      // ✅ Insert each row separately with a unique `customer_user_data_id`
      for (const line of fileStream.slice(1)) {
        const values = line.split(",");

        if (values.length !== csvHeaders.length) {
          return res
            .status(400)
            .json({ message: "CSV file format is incorrect." });
        }

        // Generate a new `customer_user_data_id` for each row
        const [result] = await pool.query(insertCustomerUserDataQuery, [
          user_id,
          1,
        ]);
        const customer_user_data_id = result.insertId;

        console.log(
          "Generated customer_user_data_id for row:",
          customer_user_data_id
        );

        for (let i = 0; i < csvHeaders.length; i++) {
          const header = csvHeaders[i];
          if (!fieldMap[header]) continue; // Skip extra columns that are not in the database

          const contact_field_id = fieldMap[header];
          const field_value = values[i];

          await pool.query(insertCustomerDataQuery, [
            user_id,
            customer_user_data_id,
            contact_field_id,
            field_value,
            1,
          ]);
        }
      }

      return res.status(200).json({
        message: "CSV data imported successfully with unique IDs!",
        unused_columns:
          missingInDatabase.length > 0 ? missingInDatabase : "None",
      });
    } catch (error) {
      console.error("Error importing CSV:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async deleteMultipleRecords(req, res) {
    try {
      const { user_id } = req.user; // Extract user_id from token
      const { row_numbers } = req.body;

      if (!Array.isArray(row_numbers) || row_numbers.length === 0) {
        return res.status(400).json({ message: "Invalid row numbers." });
      }

      const deletedCount = await customerService.deleteMultipleRecords(
        user_id,
        row_numbers
      );

      if (deletedCount === 0) {
        return res.status(404).json({ message: "No records found to delete." });
      }

      return res.status(200).json({
        message: `${deletedCount} record(s) deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting records:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async deleteAllRecords(req, res) {
    try {
      const { user_id } = req.user; // Get user_id from token

      const deletedRows = await customerService.deleteAllRecords(user_id);

      if (deletedRows === 0) {
        return res.status(404).json({ message: "No records found to delete." });
      }

      return res
        .status(200)
        .json({ message: "All records deleted successfully." });
    } catch (error) {
      console.error("Error deleting records:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async getAllUserRecords(req, res) {
    try {
      const { user_id } = req.user; // Extract user_id from token

      // Call service function to fetch records
      const userRecords = await customerService.getAllUserRecords(user_id);

      if (!userRecords || userRecords.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No records found for this user.",
          data: [],
        });
      }

      return res.status(200).json({
        status: 200,
        message: "User records retrieved successfully.",
        data: userRecords,
      });
    } catch (error) {
      console.error("Error fetching records:", error.message);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        data: [],
      });
    }
  }
  static async setOrder(req, res) {
    try {
      const { order_no } = req.body;
      const { contact_field_id } = req.params; // Extract contact_field_id from URL
      const { user_id } = req.user; // Extract user_id from token

      const result = await customerService.setOrderNo(
        user_id,
        contact_field_id,
        order_no
      );

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message });
    } catch (error) {
      console.error("Error in controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async exportSelected(req, res) {
    try {
      const { user_id } = req.user;
      const { selectedIds } = req.body;

      if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
        return res
          .status(400)
          .json({ message: "No selected customer IDs provided." });
      }

      const placeholders = selectedIds.map(() => "?").join(",");

      const [rows] = await pool.query(
        `
        SELECT 
          cud.customer_user_data_id AS id,
          GROUP_CONCAT(cd.field_name ORDER BY cd.contact_field_id) AS headers,
          GROUP_CONCAT(cdata.field_value ORDER BY cd.contact_field_id) AS field_values
        FROM CCMS.customer_user_data cud
        JOIN CCMS.customer_data cdata ON cud.customer_user_data_id = cdata.customer_user_data_id
        JOIN CCMS.customer_details cd ON cd.contact_field_id = cdata.contact_field_id
        WHERE cud.user_id = ? AND cud.customer_user_data_id IN (${placeholders})
        GROUP BY cud.customer_user_data_id
        `,
        [user_id, ...selectedIds]
      );

      if (!rows.length) {
        return res
          .status(404)
          .json({ message: "No data found for selected IDs." });
      }

      const records = rows.map((row) => {
        const keys = row.headers.split(",");
        const values = row.field_values.split(",");
        const obj = {};
        keys.forEach((key, i) => {
          obj[key] = values[i] ?? "";
        });
        return obj;
      });

      const csv = await json2csv(records);

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=selected_customers.csv"
      );
      res.set("Content-Type", "text/csv");
      return res.status(200).send(csv);
    } catch (error) {
      console.error("Export Selected Error:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async exportAll(req, res) {
    try {
      const { user_id } = req.user;

      const rows = await customerService.getAllCustomerData(user_id);

      if (!rows.length) {
        return res.status(404).json({ message: "No data found to export." });
      }

      const records = rows.map((row) => {
        const keys = row.headers.split(",");
        const values = row.field_values.split(",");
        const obj = {};
        keys.forEach((key, i) => {
          obj[key] = values[i] ?? "";
        });
        return obj;
      });

      const csv = await json2csv(records);

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=all_customers.csv"
      );
      res.set("Content-Type", "text/csv");
      return res.status(200).send(csv);
    } catch (error) {
      console.error("Export All Error:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
module.exports = customerController;
