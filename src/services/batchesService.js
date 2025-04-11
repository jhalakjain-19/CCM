const batchModel = require("../models/batchesModel.js");
class batchService {
  static async createBatchService(batch_name, user_id, criteriaList) {
    const userIds = await batchModel.getMatchingUserIds(criteriaList);
    const no_of_users = userIds.join(",");
    const no_of_users_count = userIds.length;

    const batch_id = await batchModel.insertBatch({
      batch_name,
      user_id,
      no_of_users,
      no_of_users_count,
    });

    await batchModel.insertBatchCriteria(batch_id, criteriaList);

    return {
      batch_id,
      no_of_users_count,
      no_of_users,
    };
  }
}
module.exports = batchService;
