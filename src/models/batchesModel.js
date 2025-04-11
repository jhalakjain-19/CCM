const db = require("../config/db");
class batchModel {
  static async insertBatch({
    batch_name,
    user_id,
    no_of_users,
    no_of_users_count,
  }) {
    const [result] = await db.execute(
      `INSERT INTO batch (batch_name, status, created_on, user_id, no_of_users, no_of_users_count)
       VALUES (?, 1, NOW(), ?, ?, ?)`,
      [batch_name, user_id, no_of_users, no_of_users_count]
    );
    return result.insertId;
  }

  static async insertBatchCriteria(batch_id, criteriaList) {
    for (const {
      contact_field_id,
      data_type,
      criteria_from,
      criteria_to,
      criteria_search,
    } of criteriaList) {
      await db.execute(
        `INSERT INTO batch_criteria (
          batch_id, contact_field_id, data_type,
          criteria_from, criteria_to, criteria_search, created_on
        ) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          batch_id,
          contact_field_id,
          data_type,
          criteria_from || null,
          criteria_to || null,
          criteria_search || null,
        ]
      );
    }
  }

  static async getMatchingUserIds(criteriaList) {
    let userMatches = null;

    for (const criteria of criteriaList) {
      const {
        contact_field_id,
        data_type,
        criteria_from,
        criteria_to,
        criteria_search,
      } = criteria;

      let query = `SELECT DISTINCT customer_user_data_id FROM customer_data WHERE contact_field_id = ?`;
      let params = [contact_field_id];

      if (data_type === 5 || data_type === 10) {
        query += " AND field_value BETWEEN ? AND ?";
        params.push(criteria_from, criteria_to);
        criteria.criteria_search = null;
      } else if (data_type === 8) {
        if (!criteria_search)
          throw new Error("criteria_search is required for data_type 8");

        const values = criteria_search.split(",").map((v) => v.trim());
        const likeClauses = values.map(() => "field_value LIKE ?");
        query += ` AND (${likeClauses.join(" OR ")})`;
        values.forEach((val) => params.push(`%${val}%`));

        criteria.criteria_search = criteria_search.replace(/,/g, "##");
        criteria.criteria_from = null;
        criteria.criteria_to = null;
      } else if (data_type === 2 && criteria_search === "contains") {
        query += " AND field_value LIKE ?";
        params.push(`%${criteria_from}%`);
        criteria.criteria_search = "contains";
      } else {
        query += " AND field_value = ?";
        params.push(criteria_from);
      }

      const [results] = await db.execute(query, params);
      const matchedIds = results.map((r) => r.customer_user_data_id);

      if (userMatches === null) {
        userMatches = new Set(matchedIds);
      } else {
        userMatches = new Set(matchedIds.filter((id) => userMatches.has(id)));
      }
    }

    return Array.from(userMatches);
  }
}
module.exports = batchModel;
