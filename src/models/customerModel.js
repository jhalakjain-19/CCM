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
}

module.exports = customerModel;
