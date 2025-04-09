const batchModel = require("../models/batchesModel.js");
class batchService {
  static async createBatch(batchData) {
    try {
      return await batchModel.createBatch(batchData);
    } catch (error) {
      throw error;
    }
  }
}
module.exports = batchService;
