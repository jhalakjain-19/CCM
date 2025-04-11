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
      const result = await batchService.createBatchService(
        batch_name,
        user_id,
        criteriaList
      );

      return res.status(201).json({
        message: "Batch created successfully",
        ...result,
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
