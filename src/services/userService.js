const UserModel = require("../models/userModel");
console.log("UserModel:", UserModel);

class UserService {
  static async getAllUsers() {
    // console.log("Accessing getAllUsers:", UserModel.getAllUsers());
    console.log(UserModel);
    return await UserModel.getAllUsers();
  }
  static async getUserById(userId) {
    return await UserModel.getUserById(userId);
  }
  static async deleteUser(userId) {
    return await UserModel.deleteUser(userId);
  }
  static async createUser(data) {
    return await UserModel.createUser(data);
  }
}

module.exports = UserService;
