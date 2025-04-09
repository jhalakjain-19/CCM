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
      const { batch_name, parent_batch_id } = req.body;

      if (!batch_name) {
        return res.status(400).json({ message: "batch_name is required" });
      }

      const result = await batchService.createBatch({
        batch_name,
        parent_batch_id,
      });

      res.status(201).json({
        message: "Batch created successfully",
        batchId: result.insertId,
        batchCode: result.insertId, // batch_code = batch_id
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to create batch", error: error.message });
    }
  }
}
module.exports = batchController;
