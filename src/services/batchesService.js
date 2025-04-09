const batchModel = require("../models/batchesModel.js");
class batchService {
  static async createBatch(batchData) {
    try {
      console.log("userid", batchData.user_id); // ✅ should now show actual ID
      return await batchModel.createBatch(batchData);
    } catch (error) {
      throw error;
    }
  }
}
module.exports = batchService;
