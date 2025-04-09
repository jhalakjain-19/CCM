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
      const { batch_name } = req.body;

      if (!batch_name) {
        return res.status(400).json({ message: "batch_name is required" });
      }

      console.log("Authenticated user:", req.user);
      console.log(user_id);
      const result = await batchService.createBatch({
        batch_name,
        user_id,
      });

      res.status(201).json({
        message: "Batch created successfully",
        batchId: result.insertId,
        batchCode: result.insertId, // batch_code = batch_id
      });
      console.log("Batch created successfully:", result.insertId);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to create batch", error: error.message });
    }
  }
}
module.exports = batchController;
