const customerModel = require("../models/customerModel");
class customerService {
  static async getAttrTypes() {
    return await customerModel.getAttrTypes();
  }
  static async getDataTypes() {
    return await customerModel.getDataTypes();
  }
  static async createAttribute(req) {
    return await customerModel.createAttribute(req);
  }
  // static async getAttributes() {
  //   return await customerModel.getAttributes();
  // }
  static async getAttributes(user_id) {
    return await customerModel.getAttributes(user_id);
  }

  static async deleteAttribute(contact_field_id, user_id) {
    try {
      return await customerModel.deleteAttribute(contact_field_id, user_id);
    } catch (error) {
      console.error("Service Error:", error.message);
      throw error;
    }
  }
  static async deleteRecord(user_id, row_number) {
    // Check if the record exists
    const recordExists = await customerModel.getRecordByRowNumber(
      user_id,
      row_number
    );
    if (!recordExists) {
      return false; // Record not found
    }

    // Delete the record
    return await customerModel.deleteRecord(user_id, row_number);
  }
}
module.exports = customerService;
