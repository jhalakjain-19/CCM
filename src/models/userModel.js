const pool = require("../config/db");
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
      const { Name, Email, Phone_no, Password, status, Permission } = req.body;
      console.log(req.body);
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      console.log(salt);
      const hashedPassword = await bcrypt.hash(Password, salt);
      console.log(hashedPassword);
      // Insert user data into the database
      const result = await pool.query(
        "INSERT INTO users (Name, Email, Phone_no, Password,status, Permission) VALUES(?, ?, ?, ?, ?, ?)",
        [Name, Email, Phone_no, hashedPassword, status, Permission]
      );

      // Return the created user
      const createdUser = result[0]; // result is the inserted row
      return createdUser;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
  static async updateUser(user_id, req) {
    try {
      // Step 1: Update the user record and set 'updated_at' to the current timestamp
      const updateResult = await pool.query(
        "UPDATE users SET Name = ?, Email = ?, updated_at = NOW() WHERE user_id = ?",
        [req.body.Name, req.body.Email, user_id]
      );

      // Log the update result for debugging
      console.log("Update Operation Result:", updateResult);

      // Step 2: Check if any row was updated
      if (updateResult.affectedRows === 0) {
        console.log(`No user found with ID: ${user_id}`);
        return null; // Return null if no user was updated
      }

      // Step 3: Fetch the updated user record
      const [updatedUser] = await pool.query(
        "SELECT * FROM users WHERE user_id = ?",
        [user_id]
      );

      // Log the fetched updated user data
      console.log("Updated User Data:", updatedUser);

      return updatedUser[0]; // Return the updated user
    } catch (error) {
      // Log the error for debugging
      console.error("Error updating user:", error.message);
      throw error; // Rethrow the error for higher-level handling
    }
  }

  // Get login query to fetch user by email
  static getLoginQuery(email) {
    const query = "SELECT * FROM users WHERE email = ? AND status = 1";

    return { query, values: [email] };
  }

  // Update session token in the database
  static async updateSessionToken(user_id, token) {
    try {
      const [result] = await pool.query(
        "UPDATE users SET session_token = ? WHERE user_id = ?",
        [token, user_id]
      );

      if (result.affectedRows === 0) {
        console.log(`No user found with ID: ${user_id}`);
        return null;
      }

      console.log(`Session token updated for user ID: ${user_id}`);
      return result;
    } catch (error) {
      console.error("Error updating session token:", error.message);
      throw error;
    }
  }
}

module.exports = UserModel;
