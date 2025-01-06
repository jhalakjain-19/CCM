const pool = require("../config/db");

class UserModel {
  static getAllUsers() {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM user_details", (error, results) => {
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
}

module.exports = UserModel;
