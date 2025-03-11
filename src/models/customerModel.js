const pool = require("../config/db");

class customerModel {
  static async getAttrTypes() {
    try {
      const query = `SELECT * FROM CCMS.lu_generic_values WHERE generic_key = ?`;
      const [rows] = await pool.query(query, ["Attr"]);
      return rows;
    } catch (error) {
      console.error("Error fetching attributes:", error.message);
      throw error;
    }
  }
  static async getDataTypes() {
    try {
      const query = `SELECT * FROM CCMS.lu_generic_values WHERE generic_key = ?`;
      const [rows] = await pool.query(query, ["DataType"]);
      return rows;
    } catch (error) {
      console.error("Error fetching data types:", error.message);
      throw error;
    }
  }
  static async createAttribute(req) {
    try {
      // Extract user_id from the token
      const { user_id } = req.user;
      const { field_name, data_type, attribute_type } = req.body;
      console.log("user_id", user_id);
      console.log("field_name", field_name);
      console.log("data_type", data_type);
      // Validate required fields
      if (!user_id) {
        throw new Error(
          "user_id, field_name, data_type, and attribute_type are required"
        );
      }

      // Insert into database
      const query = `
        INSERT INTO CCMS.customer_details (user_id, field_name, data_type, attribute_type)
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await pool.query(query, [
        user_id,
        field_name,
        data_type,
        attribute_type,
      ]);

      return { message: "Attribute created successfully", user_id };
    } catch (error) {
      console.error("Error creating attribute:", error.message);
      throw error;
    }
  }

  // static async getAttributes() {
  //   try {
  //     const query = `SELECT * FROM CCMS.customer_details`;
  //     const [rows] = await pool.query(query);
  //     return rows;
  //   } catch (error) {
  //     console.error("Error fetching attributes:", error.message);
  //     throw error;
  //   }
  // }
  static async getAttributes(user_id) {
    try {
      const query = `SELECT * FROM CCMS.customer_details WHERE user_id = ?`;
      const [rows] = await pool.query(query, [user_id]);
      return rows;
    } catch (error) {
      console.error("Error fetching attributes:", error.message);
      throw error;
    }
  }

  // static async deleteAttribute(contact_field_id, user_id) {
  //   try {
  //     const query = `DELETE FROM CCMS.customer_details WHERE contact_field_id = ? AND user_id = ?`;

  //     const [result] = await pool.query(query, [contact_field_id, user_id]);
  //     return result;
  //   } catch (error) {
  //     console.error("Database Error:", error.message);
  //     throw error;
  //   }
  // }
  static async deleteAttribute(contact_field_id, user_id) {
    try {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // Delete related records from CCMS.customer_data first
        const deleteCustomerDataQuery = `DELETE FROM CCMS.customer_data WHERE contact_field_id = ? AND user_id = ?`;
        await connection.query(deleteCustomerDataQuery, [
          contact_field_id,
          user_id,
        ]);

        // Delete attribute from CCMS.customer_details
        const deleteAttributeQuery = `DELETE FROM CCMS.customer_details WHERE contact_field_id = ? AND user_id = ?`;
        const [result] = await connection.query(deleteAttributeQuery, [
          contact_field_id,
          user_id,
        ]);

        await connection.commit();
        return result;
      } catch (error) {
        await connection.rollback();
        console.error("Transaction Error:", error.message);
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Database Error:", error.message);
      throw error;
    }
  }
  // static async deleteMultipleRecords(user_id, row_numbers) {
  //   try {
  //     const deleteQuery = `
  //       DELETE FROM CCMS.customer_data
  //       WHERE user_id = ? AND row_number IN (?)
  //     `;

  //     const [result] = await pool.query(deleteQuery, [user_id, row_numbers]);
  //     return result.affectedRows; // Number of rows deleted
  //   } catch (error) {
  //     throw new Error("Database Error: " + error.message);
  //   }
  // }
  static async deleteMultipleRecords(user_id, row_numbers) {
    try {
      // ✅ Step 1: Delete from `customer_data`
      const deleteCustomerDataQuery = `
            DELETE FROM CCMS.customer_data 
            WHERE user_id = ? AND customer_user_data_id IN (?)
        `;

      // ✅ Step 2: Delete from `customer_user_data`
      const deleteCustomerUserDataQuery = `
            DELETE FROM CCMS.customer_user_data 
            WHERE user_id = ? AND customer_user_data_id IN (?)
        `;

      // Delete from `customer_data`
      const [customerDataResult] = await pool.query(deleteCustomerDataQuery, [
        user_id,
        row_numbers,
      ]);

      // Delete from `customer_user_data`
      const [customerUserDataResult] = await pool.query(
        deleteCustomerUserDataQuery,
        [user_id, row_numbers]
      );

      // Total records deleted
      const totalDeleted =
        customerDataResult.affectedRows + customerUserDataResult.affectedRows;

      return totalDeleted; // Return number of deleted records
    } catch (error) {
      throw new Error("Database Error: " + error.message);
    }
  }

  // static async deleteAllRecords(user_id) {
  //   try {
  //     const deleteQuery = `
  //       DELETE FROM CCMS.customer_data
  //       WHERE user_id = ?
  //     `;

  //     const [result] = await pool.query(deleteQuery, [user_id]);
  //     return result.affectedRows; // Number of rows deleted
  //   } catch (error) {
  //     throw new Error("Database Error: " + error.message);
  //   }
  // }
  static async deleteAllRecords(user_id) {
    try {
      // ✅ Step 1: Delete from `customer_data`
      const deleteCustomerDataQuery = `
            DELETE FROM CCMS.customer_data 
            WHERE user_id = ?
        `;

      // ✅ Step 2: Delete from `customer_user_data`
      const deleteCustomerUserDataQuery = `
            DELETE FROM CCMS.customer_user_data 
            WHERE user_id = ?
        `;

      // Delete from `customer_data`
      const [customerDataResult] = await pool.query(deleteCustomerDataQuery, [
        user_id,
      ]);

      // Delete from `customer_user_data`
      const [customerUserDataResult] = await pool.query(
        deleteCustomerUserDataQuery,
        [user_id]
      );

      // Total records deleted
      const totalDeleted =
        customerDataResult.affectedRows + customerUserDataResult.affectedRows;

      return totalDeleted; // Return number of deleted records
    } catch (error) {
      throw new Error("Database Error: " + error.message);
    }
  }
  // static async getAllUserRecords(user_id) {
  //   try {
  //     const query = `
  //           SELECT * FROM CCMS.customer_data
  //           WHERE user_id = ?
  //       `;

  //     const [rows] = await pool.query(query, [user_id]);

  //     return rows; // Returns data in row format
  //   } catch (error) {
  //     throw new Error("Database Error: " + error.message);
  //   }
  // }
  static async getAllUserRecords(user_id) {
    try {
      // Get field names from customer_details for the given user_id
      const fieldQuery = `
            SELECT field_name FROM CCMS.customer_details 
            WHERE user_id = ?;
        `;
      const [fieldRows] = await pool.query(fieldQuery, [user_id]);

      // Extract field names into an array
      const fieldNames = fieldRows.map((row) => row.field_name);

      // Get user data from customer_data for the given user_id
      const dataQuery = `
            SELECT * FROM CCMS.customer_data 
            WHERE user_id = ?;
        `;
      const [dataRows] = await pool.query(dataQuery, [user_id]);

      return {
        fields: fieldNames, // Field names from customer_details
        data: dataRows, // User records from customer_data
      };
    } catch (error) {
      throw new Error("Database Error: " + error.message);
    }
  }
}

module.exports = customerModel;
