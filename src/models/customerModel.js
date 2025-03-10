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
}

module.exports = customerModel;
