const pool = require("../config/db");
class batchModel {
  static async createBatch(batchData) {
    const insertSql = `
      INSERT INTO batch (batch_name, parent_batch_id, status, created_on, user_id)
      VALUES (?, NULL, 1, NOW(), ?)
    `;
    const values = [batchData.batch_name, batchData.user_id];
    const [insertResult] = await pool.query(insertSql, values);

    const batchId = insertResult.insertId;
    await pool.query(`UPDATE batch SET batch_code = ? WHERE batch_id = ?`, [
      batchId,
      batchId,
    ]);

    return { insertId: batchId };
  }

  static async insertBatchCriteria({
    batch_id,
    contact_field_id,
    data_type,
    criteria_from,
    criteria_to,
    criteria_search,
    no_of_users_count,
    no_of_users,
  }) {
    const insertSql = `
      INSERT INTO batch_criteria
      (batch_id, contact_field_id, data_type, criteria_from, criteria_to, criteria_search, no_of_users_count, no_of_users, status, created_on)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())
    `;

    const values = [
      batch_id,
      contact_field_id,
      data_type,
      criteria_from,
      criteria_to,
      criteria_search,
      no_of_users_count,
      no_of_users,
    ];

    await pool.query(insertSql, values);
  }
}
module.exports = batchModel;
