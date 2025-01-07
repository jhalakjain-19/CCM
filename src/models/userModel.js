const pool = require("../config/db").promise();
const bcrypt = require("bcrypt");
// const userCreateSchema = require("../middlewares/userValidator.js");
class UserModel {
  static async getAllUsers() {
    try {
      // Execute the query and wait for the results
      const results = await pool.query("SELECT * FROM users");

      // Log the results for debugging
      console.log("Query Results:", results);

      // Return the results
      return results;
    } catch (error) {
      // Log and rethrow the error for further handling
      console.error("Error fetching users:", error.message);
      throw error;
    }
  }

  static async getUserById(user_id) {
    try {
      // Execute the query and wait for the result
      const [result] = await pool.query(
        "SELECT * FROM users WHERE user_id = ?",
        [user_id]
      );

      // Log the result for debugging
      console.log("Query Result:", result);

      // Check if the user is found
      if (result && result.length > 0) {
        return result[0]; // Return the user with the given ID
      } else {
        return null; // No user found, return null
      }
    } catch (error) {
      // Log the error for debugging
      console.error("Error fetching user by ID:", user_id, error.message);
      throw error; // Rethrow the error for further handling
    }
  }

  static async deleteUser(user_id) {
    try {
      // Step 1: Fetch user by ID
      const [userResult] = await pool.query(
        "SELECT * FROM users WHERE user_id = ?",
        [user_id]
      );

      // Check if user exists
      if (userResult.length === 0) {
        console.log("No user found with ID:", user_id);
        return null; // Return null if no user found
      }

      // Log the fetched user data
      console.log("Fetched User Data:", userResult[0]);

      // Step 2: Delete the user
      const [deleteResult] = await pool.query(
        "DELETE FROM users WHERE user_id = ?",
        [user_id]
      );

      // Log the delete result
      console.log("Delete Operation Result:", deleteResult);

      // Step 3: Return the deleted user's data
      return userResult[0];
    } catch (error) {
      // Log and rethrow the error for further handling
      console.error("Error deleting user:", error.message);
      throw error;
    }
  }

  static async createUser(req) {
    try {
      // // Validate request body using Joi schema
      // const { error } = userCreateSchema.validate(req.body);
      // if (error) {
      //   throw new Error(error.details[0].message);
      // }

      const {
        Name,
        Email,
        Phone_no,
        Password,
        status,
        Permission,
        created_on,
      } = req.body;
      console.log(req.body);
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      console.log(salt);
      const hashedPassword = await bcrypt.hash(Password, salt);
      console.log(hashedPassword);
      // Insert user data into the database
      const result = await pool.query(
        "INSERT INTO users (Name, Email, Phone_no, Password,status, Permission,created_on) VALUES(?, ?, ?, ?, ?, ?, ?)",
        [Name, Email, Phone_no, hashedPassword, status, Permission, created_on]
      );

      // Return the created user
      const createdUser = result[0]; // result is the inserted row
      return createdUser;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}

module.exports = UserModel;
