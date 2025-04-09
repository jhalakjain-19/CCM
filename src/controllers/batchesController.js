const pool = require("../config/db");
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
    try {
      const { user_id } = req.user;
      const { batch_name, criteriaList } = req.body;

      if (!batch_name) {
        return res.status(400).json({ message: "batch_name is required" });
      }

      const result = await batchService.createBatch({ batch_name, user_id });
      const batch_id = result.insertId;

      if (criteriaList && Array.isArray(criteriaList)) {
        for (const criteria of criteriaList) {
          await batchService.insertBatchCriteria({ batch_id, ...criteria });
        }
      }

      return res.status(201).json({
        message: "Batch created successfully",
        batchId: batch_id,
        batchCode: batch_id,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to create batch",
        error: error.message,
      });
    }
  }
}
module.exports = batchController;
