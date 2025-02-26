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
}
module.exports = customerService;
