const db = require("../config/db");
const batchService = require("../services/batchesService");
class batchController {
  static handleResponse(res, status, message, data = null) {
    console.log(status);

    res.status(status).json({
      status,
      message,
      data,
    });
  }
  static async createBatch(req, res) {
    const { batch_name, criteriaList } = req.body;
    const user_id = req.user.user_id;

    if (!batch_name || !criteriaList || !Array.isArray(criteriaList)) {
      return res
        .status(400)
        .json({ message: "Missing batch_name or criteriaList" });
    }

    try {
      let userMatches = new Set();

      for (const criteria of criteriaList) {
        const {
          contact_field_id,
          data_type,
          criteria_from,
          criteria_to,
          criteria_search,
        } = criteria;

        let query = `
          SELECT DISTINCT customer_user_data_id
          FROM customer_data
          WHERE contact_field_id = ?
        `;
        let params = [contact_field_id];

        if (data_type === 5 || data_type === 10) {
          query += " AND field_value BETWEEN ? AND ?";
          params.push(criteria_from, criteria_to);
        } else if (data_type === 8) {
          const values = criteria_from.split(",").map((v) => v.trim());
          const likeClauses = values.map(() => "field_value LIKE ?");
          query += ` AND (${likeClauses.join(" OR ")})`;
          values.forEach((val) => params.push(`%${val}%`));
        } else if (data_type === 2 && criteria_search === "contains") {
          query += " AND field_value LIKE ?";
          params.push(`%${criteria_from}%`);
        } else {
          query += " AND field_value = ?";
          params.push(criteria_from);
        }

        const [results] = await db.execute(query, params);
        results.forEach((row) => userMatches.add(row.customer_user_data_id));
      }

      const no_of_users_array = Array.from(userMatches);
      const no_of_users = no_of_users_array.join(",");
      const no_of_users_count = no_of_users_array.length;

      // Insert into batch table
      const [batchResult] = await db.execute(
        `INSERT INTO batch (batch_name, status, created_on, user_id, no_of_users, no_of_users_count)
         VALUES (?, 1, NOW(), ?, ?, ?)`,
        [batch_name, user_id, no_of_users, no_of_users_count]
      );

      const batch_id = batchResult.insertId;

      // Insert into batch_criteria table
      for (const criteria of criteriaList) {
        const {
          contact_field_id,
          data_type,
          criteria_from,
          criteria_to,
          criteria_search,
        } = criteria;

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

      return res.status(201).json({
        message: "Batch created successfully",
        batch_id,
        no_of_users_count,
        no_of_users,
      });
    } catch (error) {
      console.error("Error creating batch:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
module.exports = batchController;
