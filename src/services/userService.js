const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
console.log("UserModel:", UserModel);
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
class UserService {
  static async getAllUsers() {
    // console.log("Accessing getAllUsers:", UserModel.getAllUsers());
    //console.log(UserModel);
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
  static async updateUser(userId, data) {
    return await UserModel.updateUser(userId, data);
  }

  static async loginUser(req, userData) {
    // Check if the user exists by phone
    const user = await this.validateUser(req, userData);

    if (!user) {
      throw new Error("Email or Password is incorrect!");
    }

    // Check if the user is verified and active
    if (user.status !== 1) {
      throw new Error(
        "Your authentication is blocked, please contact the administrator."
      );
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    // Update session token in the database
    await UserModel.updateSessionToken(user.user_id, token);

    return { msg: "Login successful!", token };
  }
  // Validate user by email
  static async validateUser(req, userData) {
    // Extract email from req.body
    const { Email, Password } = userData;

    console.log("Received request body:", req.body);

    if (!Email || !Password) {
      console.error("Missing email or password in request body!");
      throw new Error("Email and password are required");
    }

    console.log("Validating user:", Email);
    const users = await UserModel.getUserByEmail(Email);

    if (!users || users.length === 0) {
      console.log("User not found:", users);
      return null; // User doesn't exist
    }

    const user = users[0]; // Extract the first user object
    console.log("User found:", user);

    if (!user.Password) {
      console.log("Password missing in DB:", user);
      return null; // Password is missing
    }

    // Compare hashed passwords
    const validPassword = await bcrypt.compare(Password, user.Password);
    if (!validPassword) {
      console.log("Invalid password for user:", Email);
      return null; // Incorrect password
    }

    return user;
  }

  // Call the changePassword function from UserModel
  static async changePassword(user_id, currentPassword, newPassword) {
    try {
      const result = await UserModel.changePassword(
        user_id,
        currentPassword,
        newPassword
      );
      return result; // Returning success message
    } catch (error) {
      console.error("Error in UserService:", error.message);
      throw error;
    }
  }
  static async getPermissionByUserId(userId) {
    return await UserModel.getPermissionByUserId(userId);
  }
  static async setPermissionByUserId(userId, permission) {
    return await UserModel.setPermissionByUserId(userId, permission);
  }
  static async getAllPermissions() {
    return await UserModel.getAllPermissions();
  }
  static async setStatusByUserId(userId, status) {
    return await UserModel.setStatusByUserId(userId, status);
  }
}

module.exports = UserService;
