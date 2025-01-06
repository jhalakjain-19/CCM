const UserModel = require("../models/userModel");
console.log("UserModel:", UserModel);

class UserService {
  static async getAllUsers() {
    // console.log("Accessing getAllUsers:", UserModel.getAllUsers());
    console.log(UserModel);
    return await UserModel.getAllUsers();
  }
}

module.exports = UserService;
