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

    if (
      !batch_name ||
      !Array.isArray(criteriaList) ||
      criteriaList.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Missing batch_name or criteriaList" });
    }

    try {
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
        } else if (data_type === 8) {
          if (!criteria_search) {
            throw new Error("criteria_search is required for data_type 8");
          }
          const values = criteria_search.split(",").map((v) => v.trim());
          const likeClauses = values.map(() => "field_value LIKE ?");
          query += ` AND (${likeClauses.join(" OR ")})`;
          values.forEach((val) => params.push(`%${val}%`));

          // Replace commas with ##
          criteria.criteria_search = criteria_search.replace(/,/g, "##");
          criteria.criteria_from = null; // Force from/to null for storage
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
          // Intersect: keep only those already in set
          userMatches = new Set(matchedIds.filter((id) => userMatches.has(id)));
        }
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

      // Insert criteria into batch_criteria
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
      return res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }
}
module.exports = batchController;
