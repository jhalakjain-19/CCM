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
  }) {
    if (data_type === 5 || data_type === 10) {
      if (!criteria_from || !criteria_to) {
        throw new Error(
          "criteria_from and criteria_to are required for data_type 5 or 10"
        );
      }
      criteria_search = null;
    }

    const insertSql = `
      INSERT INTO batch_criteria
      (batch_id, contact_field_id, data_type, criteria_from, criteria_to, criteria_search, status, created_on)
      VALUES (?, ?, ?, ?, ?, ?, 1, NOW())
    `;

    const values = [
      batch_id,
      contact_field_id,
      data_type,
      criteria_from,
      criteria_to,
      criteria_search,
    ];

    await pool.query(insertSql, values);
  }

  static async updateBatchUserMatchInfo(batch_id, count, ids) {
    await pool.query(
      `UPDATE batch SET no_of_users_count = ?, no_of_users = ? WHERE batch_id = ?`,
      [count, ids, batch_id]
    );
  }

  static async getBatchCriteria(batch_id) {
    const [rows] = await pool.query(
      `SELECT * FROM batch_criteria WHERE batch_id = ? AND status = 1`,
      [batch_id]
    );
    return rows;
  }

  static async getMatchingUserIdsByCriteria(criteria, user_id) {
    const {
      contact_field_id,
      data_type,
      criteria_from,
      criteria_to,
      criteria_search,
    } = criteria;

    let condition = `user_id = ? AND contact_field_id = ? AND status = 1`;
    const params = [user_id, contact_field_id];

    if (data_type === 5 || data_type === 10) {
      condition += ` AND CAST(field_value AS DECIMAL) BETWEEN ? AND ?`;
      params.push(criteria_from, criteria_to);
    } else if (criteria_search === "contains") {
      condition += ` AND field_value LIKE ?`;
      params.push(`%${criteria_from}%`);
    } else if (criteria_search === "startsWith") {
      condition += ` AND field_value LIKE ?`;
      params.push(`${criteria_from}%`);
    } else if (criteria_search === "endsWith") {
      condition += ` AND field_value LIKE ?`;
      params.push(`%${criteria_from}`);
    }

    const [rows] = await pool.query(
      `SELECT DISTINCT customer_user_data_id FROM customer_data WHERE ${condition}`,
      params
    );

    return rows.map((r) => r.customer_user_data_id);
  }
}
module.exports = batchModel;
