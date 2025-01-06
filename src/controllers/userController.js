const UserService = require("../services/userService");

class UserController {
  static handleResponse(res, status, message, data = null) {
    console.log(status);

    res.status(status).json({
      status,
      message,
      data,
    });
  }
  // static async createUser(req, res, next) {
  //   try {
  //     const newUser = await UserService.createUser(req);
  //     UserController.handleResponse(
  //       res,
  //       201,
  //       "user created successfully",
  //       newUser
  //     );
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  static async getAllUsers(req, res, next) {
    // return 1;
    try {
      const users = await UserService.getAllUsers();
      console.log(users);
      UserController.handleResponse(
        res,
        200,
        "Users fetched successfully",
        users
      );
    } catch (error) {
      next(error);
    }
  }
}
module.exports = UserController;
