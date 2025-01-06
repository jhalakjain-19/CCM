const pool = require("../config/db");

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
}

module.exports = UserModel;
