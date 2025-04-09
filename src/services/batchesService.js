const batchModel = require("../models/batchesModel.js");
class batchService {
  static async createBatch(batchData) {
    return await batchModel.createBatch(batchData);
  }

  static async insertBatchCriteria(criteriaData) {
    return await batchModel.insertBatchCriteria(criteriaData);
  }
}
module.exports = batchService;
