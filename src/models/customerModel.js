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
      const { customer_id, field_name, data_type, attribute_type } = req.body;

      // Validate required fields
      if (!customer_id || !field_name || !data_type || !attribute_type) {
        throw new Error(
          "customer_id, field_name, data_type, and attribute_type are required"
        );
      }

      // Insert into database (MySQL will handle created_on automatically)
      const query = `
        INSERT INTO CCMS.customer_details (customer_id, field_name, data_type, attribute_type)
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await pool.query(query, [
        customer_id,
        field_name,
        data_type,
        attribute_type,
        status,
      ]);

      return { message: "Attribute created successfully", id: result.insertId };
    } catch (error) {
      console.error("Error creating attribute:", error.message);
      throw error;
    }
  }
  static async getAttributes() {
    try {
      const query = `SELECT * FROM CCMS.customer_details`;
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Error fetching attributes:", error.message);
      throw error;
    }
  }
}

module.exports = customerModel;
