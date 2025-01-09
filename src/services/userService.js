const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
console.log("UserModel:", UserModel);
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
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
  static async updateUser(userId, data) {
    return await UserModel.updateUser(userId, data);
  }
  static async loginUser(req, userData) {
    try {
      // Normalize userData keys to match expected keys
      const normalizedUserData = {
        email: userData.Email, // Adjust casing
        password: userData.Password,
      };

      console.log("Normalized userData:", normalizedUserData);

      // Check if the user exists by email
      const user = await this.validateUser(normalizedUserData);

      if (!user) {
        throw new Error("Email or Password is incorrect!");
      }

      // Check if the user is verified and active
      if (user.status !== 1) {
        throw new Error(
          "Your authentication is blocked, please contact the administrator."
        );
      }

      // Generate JWT token
      const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // Update session token in the database
      await UserModel.updateSessionToken(user.user_id, token);

      return { msg: "Login successful!", token };
    } catch (error) {
      console.error("Error in loginUser:", error.message);
      throw error;
    }
  }

  // Validate user by email and password
  static async validateUser(userData) {
    const { query, values } = UserModel.getLoginQuery(userData.email);

    try {
      console.log("Executing query:", query);
      console.log("With values:", values);

      const [rows] = await pool.query(query, values);

      if (!Array.isArray(rows) || rows.length === 0) {
        console.log("No user found with the provided email.");
        return null;
      }

      console.log("Rows retrieved:", rows); // Log the rows

      // Continue with password comparison if data is present
      const hashedPassword = rows[0].password;

      //console.log("Hashed password from DB:", hashedPassword);
      return rows[0];
    } catch (error) {
      console.error("Error during query execution:", error.message);
      throw error;
    }
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
}

module.exports = UserService;
