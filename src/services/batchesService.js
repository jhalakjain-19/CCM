const batchModel = require("../models/batchesModel.js");
class batchService {
  static async createBatch(batchData) {
    return await batchModel.createBatch(batchData);
  }

  static async insertBatchCriteria(criteriaData) {
    return await batchModel.insertBatchCriteria(criteriaData);
  }
  static async processAndStoreMatchedUsers(batch_id, user_id) {
    const criteriaList = await batchModel.getBatchCriteria(batch_id);
    const matchMap = new Map(); // customer_user_data_id => match count
    const totalCriteria = criteriaList.length;

    for (const criteria of criteriaList) {
      const userIds = await batchModel.getMatchingUserIdsByCriteria(
        criteria,
        user_id
      );

      for (const id of userIds) {
        matchMap.set(id, (matchMap.get(id) || 0) + 1);
      }
    }

    const finalUserIds = Array.from(matchMap.entries())
      .filter(([_, count]) => count === totalCriteria)
      .map(([id]) => id);

    return {
      no_of_users_count: finalUserIds.length,
      no_of_users: finalUserIds.join(","),
    };
  }

  static async updateBatchUserMatchInfo(batch_id, count, ids) {
    await batchModel.updateBatchUserMatchInfo(batch_id, count, ids);
  }
}
module.exports = batchService;
