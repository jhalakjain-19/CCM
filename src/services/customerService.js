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
  static async getAttributes() {
    return await customerModel.getAttributes();
  }
  static async deleteAttribute(contact_field_id) {
    try {
      return await customerModel.deleteAttribute(contact_field_id);
    } catch (error) {
      console.error("Service Error:", error.message);
      throw error;
    }
  }
}
module.exports = customerService;
