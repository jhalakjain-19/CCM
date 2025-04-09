const pool = require("../config/db");
class batchModel {
  static async createBatch(batchData) {
    try {
      console.log("userid", batchData.user_id);
      const insertSql = `
        INSERT INTO batch (batch_name, parent_batch_id, status, created_on,user_id)
        VALUES (?, null, 1, NOW(),?)
      `;
      const values = [batchData.batch_name, batchData.user_id];

      const [insertResult] = await pool.query(insertSql, values);
      const batchId = insertResult.insertId;

      const updateSql = `UPDATE batch SET batch_code = ? WHERE batch_id = ?`;
      await pool.query(updateSql, [batchId, batchId]);

      return { insertId: batchId };
    } catch (error) {
      throw error;
    }
  }
}
module.exports = batchModel;
