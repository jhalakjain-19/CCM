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
  static async deleteMultipleRecords(user_id, row_numbers) {
    return await customerModel.deleteMultipleRecords(user_id, row_numbers);
  }
  static async deleteAllRecords(user_id) {
    return await customerModel.deleteAllRecords(user_id);
  }
  static async getAllUserRecords(user_id) {
    return await customerModel.getAllUserRecords(user_id);
  }
  static async setOrderNo(user_id, contact_field_id, order_no) {
    try {
      if (!user_id || !contact_field_id || order_no === undefined) {
        throw new Error("user_id, contact_field_id, and order_no are required");
      }

      const result = await customerModel.updateOrderNo(
        user_id,
        contact_field_id,
        order_no
      );

      if (result.affectedRows === 0) {
        return { success: false, message: "No matching record found" };
      }

      return { success: true, message: "Order number updated successfully" };
    } catch (error) {
      console.error("Error in service:", error.message);
      throw error;
    }
  }
}
module.exports = customerService;
