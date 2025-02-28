const customerService = require("../services/customerService");
class customerController {
  static handleResponse(res, status, message, data = null) {
    console.log(status);

    res.status(status).json({
      status,
      message,
      data,
    });
  }
  static async getAttrTypes(req, res, next) {
    try {
      const attrTypes = await customerService.getAttrTypes();
      customerController.handleResponse(
        res,
        200,
        "Attribute types fetched successfully",
        attrTypes
      );
    } catch (error) {
      next(error);
    }
  }
  static async getDataTypes(req, res, next) {
    try {
      const dataTypes = await customerService.getDataTypes();
      customerController.handleResponse(
        res,
        200,
        "Data types fetched successfully",
        dataTypes
      );
    } catch (error) {
      next(error);
    }
  }
  static async createAttribute(req, res, next) {
    try {
      const newAttribute = await customerService.createAttribute(req);
      customerController.handleResponse(
        res,
        201,
        "Attribute created successfully",
        newAttribute
      );
    } catch (error) {
      next(error);
    }
  }
  static async getAttributes(req, res, next) {
    try {
      const attributes = await customerService.getAttributes();
      customerController.handleResponse(
        res,
        200,
        "Attributes fetched successfully",
        attributes
      );
    } catch (error) {
      next(error);
    }
  }
  static async deleteAttribute(req, res, next) {
    try {
      const { contact_field_id } = req.params;

      if (!contact_field_id) {
        return res
          .status(400)
          .json({ message: "contact_field_id is required" });
      }

      const result = await customerService.deleteAttribute(contact_field_id);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Attribute not found" });
      }

      return res
        .status(200)
        .json({ message: "Attribute deleted successfully" });
    } catch (error) {
      console.error("Error deleting attribute:", error.message);
      next(error);
    }
  }
}
module.exports = customerController;
