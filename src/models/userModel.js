const pool = require("../config/db").promise();
const bcrypt = require("bcrypt");
// const userCreateSchema = require("../middlewares/userValidator.js");
class UserModel {
  static getAllUsers() {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM users", (error, results) => {
        if (error) {
          console.error("Error fetching users:", error.message);
          reject(error); // Reject the promise with the error
        } else {
          console.log("Query Results:", results); // Log the results for debugging
          resolve(results); // Resolve the promise with the results
        }
      });
    });
  }
  static getUserById(user_id) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM users WHERE user_id = ?",
        [user_id],
        (error, result) => {
          if (error) {
            console.error("Error fetching user by ID:", user_id);
            return reject(error); // Reject the promise in case of error
          }

          // If user is found, resolve the promise with the user data
          if (result && result.length > 0) {
            resolve(result[0]); // Return the user with the given ID
          } else {
            resolve(null); // No user found, resolve with null
          }
        }
      );
    });
  }
  static deleteUser(user_id) {
    return new Promise((resolve, reject) => {
      // Step 1: Fetch user by ID
      pool.query(
        "SELECT * FROM users WHERE user_id = ?",
        [user_id],
        (error, result) => {
          if (error) {
            console.error("Error fetching user by ID:", error.message);
            return reject(error); // Reject if fetching user fails
          }

          // Log the fetched result to ensure user exists
          console.log("Fetched User Data:", result);

          // Step 2: If no user found, return null
          if (result.length === 0) {
            console.log("No user found with ID:", user_id);
            return resolve(null);
          }

          // Step 3: Delete user if found
          pool.query(
            "DELETE FROM users WHERE user_id = ?",
            [user_id],
            (error, deleteResult) => {
              if (error) {
                console.error("Error deleting user:", error.message);
                return reject(error); // Reject if deletion fails
              }

              // Log the delete result to ensure deletion happened
              console.log("Delete Operation Result:", deleteResult);

              // Step 4: Resolve with the deleted user's data (the user data we fetched earlier)
              resolve(result[0]); // Return the user data before deletion
            }
          );
        }
      );
    });
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
      const createdUser = result; // result is the inserted row
      return createdUser;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}

module.exports = UserModel;
