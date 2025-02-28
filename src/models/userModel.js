const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
// const userCreateSchema = require("../middlewares/userValidator.js");
class UserModel {
  static async getAllUsers() {
    try {
      const [results] = await pool.query(
        "SELECT user_id,Name,Email,Phone_no,status,permission,created_on,updated_at FROM users"
      );
      return results; // Extract only the first element (actual data)
    } catch (error) {
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

  // static async createUser(req) {
  //   try {
  //     const currentTimestamp = new Date();
  //     const { Name, Email, Phone_no, Password } = req.body;
  //     console.log(req.body);

  //     // Step 1: Check if a user with the provided email already exists in the database
  //     const [existingUser] = await pool.query(
  //       "SELECT * FROM users WHERE Email = ?",
  //       [Email]
  //     );

  //     if (existingUser.length > 0) {
  //       // If the email already exists, return an error response
  //       throw new Error("Email is already in use.");
  //     }

  //     // Step 2: Hash the password if email is not duplicated
  //     const salt = await bcrypt.genSalt(10);
  //     const hashedPassword = await bcrypt.hash(Password, salt);

  //     // Step 3: Format the role (array or comma-separated string)
  //     // const formattedRole = Array.isArray(role) ? JSON.stringify(role) : role;

  //     // Step 4: Insert the new user data into the database
  //     const result = await pool.query(
  //       "INSERT INTO users (Name, Email, Phone_no, Password, created_on) VALUES(?, ?, ?, ?, ?)",
  //       [Name, Email, Phone_no, hashedPassword, currentTimestamp]
  //     );

  //     // Return the created user (typically, you might want to send a success message instead of the full user)
  //     const createdUser = result[0]; // result is the inserted row
  //     return createdUser;
  //   } catch (error) {
  //     console.error(error.message);
  //     throw error;
  //   }
  // }
  static async createUser(req) {
    try {
      const currentTimestamp = new Date();
      const { Name, Email, Phone_no, Password } = req.body;
      console.log(req.body);

      // Step 1: Check if a user with the provided email already exists in the database
      const [existingUser] = await pool.query(
        "SELECT * FROM users WHERE Email = ?",
        [Email]
      );

      if (existingUser.length > 0) {
        throw new Error("Email is already in use.");
      }

      // Step 2: Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Password, salt);

      // Step 3: Insert the new user into the database
      const [result] = await pool.query(
        "INSERT INTO users (Name, Email, Phone_no, Password, created_on,status) VALUES(?, ?, ?, ?, ?,?)",
        [Name, Email, Phone_no, hashedPassword, currentTimestamp, 0]
      );

      // Get the newly created user's ID
      const user_id = result.insertId;

      // Step 4: Insert default attributes for the new user
      const defaultFields = [
        { field_name: "first_name", data_type: 4, attribute_type: 1 },
        { field_name: "last_name", data_type: 4, attribute_type: 1 },
        { field_name: "city", data_type: 4, attribute_type: 1 },
        { field_name: "email", data_type: 7, attribute_type: 1 },
      ];

      const query = `
            INSERT INTO CCMS.customer_details (user_id, field_name, data_type, attribute_type, status, created_on)
            VALUES (?, ?, ?, ?, 1, ?)
        `;

      for (const field of defaultFields) {
        await pool.query(query, [
          user_id,
          field.field_name,
          field.data_type,
          field.attribute_type,
          currentTimestamp,
        ]);
      }

      return {
        user_id,
      };
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  static async updateUser(user_id, req) {
    try {
      const currentTimestamp = new Date();
      // Step 1: Update the user record and set 'updated_at' to the current timestamp
      const updateResult = await pool.query(
        "UPDATE users SET Name = ?, Phone_no = ?, updated_at = ? WHERE user_id = ?",
        [req.body.Name, req.body.Phone_no, currentTimestamp, user_id]
      );
      console.log("Updated_at", currentTimestamp);

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
  static async getUserByEmail(email) {
    const query = "SELECT * FROM users WHERE Email = ?";
    try {
      console.log("Executing query:", query, "with email:", email);
      const [rows] = await pool.query(query, [email]);

      if (!rows || rows.length === 0) {
        console.log("No user found with email:", email);
        return null;
      }
      console.log("User found:", rows[0]);
      return rows[0]; // Return the first user found
    } catch (error) {
      console.error("Error fetching user by email:", error.message);
      throw error;
    }
  }
  static async generateResetToken(user) {
    if (!user) {
      throw new Error("Invalid user object or email");
    }
    console.log("User found:", user);

    try {
      console.log("Generating reset token for user:", user.Email);
      // Generate a JWT token
      const token = jwt.sign(
        { Email: user.Email },
        JWT_SECRET,
        { expiresIn: "1h" } // Token expires in 1 hour
      );

      // Store the token in the database
      await pool.query(`UPDATE users SET reset_token = ? WHERE Email = ?`, [
        token,
        user.Email,
      ]);

      return token;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error generating token");
    }
  }
  static async updateSessionToken(user_id, token) {
    try {
      const [result] = await pool.execute(
        `UPDATE users SET session_token = ?, updated_at = NOW() WHERE user_id = ?`,
        [token, user_id]
      );
      return result;
    } catch (error) {
      console.error("Database Error:", error.message);
      throw error;
    }
  }
  // Function to change the user's password
  static async changePassword(user_id, currentPassword, newPassword) {
    try {
      // Step 1: Fetch the user record from the database using the user_id
      const [user] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
        user_id,
      ]);

      if (!user || user.length === 0) {
        throw new Error("User not found");
      }

      // Step 2: Compare the current password with the stored password
      const isMatch = await bcrypt.compare(currentPassword, user[0].Password);
      if (!isMatch) {
        throw new Error("Current password is incorrect");
      }

      // Step 3: Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // Step 4: Update the password in the database
      const updateResult = await pool.query(
        "UPDATE users SET Password = ?, updated_at = ? WHERE user_id = ?",
        [hashedNewPassword, new Date(), user_id]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error("Failed to update password");
      }

      // Return a success message
      return "Password updated successfully";
    } catch (error) {
      console.error("Error changing password:", error.message);
      throw error;
    }
  }
  static async getPermissionByUserId(userId) {
    try {
      const [result] = await pool.query(
        `SELECT permission FROM users
             WHERE user_id = ?`,
        [userId]
      );
      return result;
    } catch (error) {
      console.error("Error fetching permissions from DB:", error.message);
      throw error;
    }
  }
  // static async setPermissionByUserId(userId, permission) {
  //   try {
  //     const [result] = await pool.query(
  //       `UPDATE users SET permission = ? WHERE user_id = ?`,
  //       [permission, userId]
  //     );

  //     return result.affectedRows > 0; // Returns true if at least one row was updated
  //   } catch (error) {
  //     console.error("Error updating permission in DB:", error.message);
  //     throw error;
  //   }
  // }
  static async setPermissionByUserId(userId, permission) {
    try {
      const newPermission = permission === "NULL" ? null : permission;

      const [result] = await pool.query(
        `UPDATE users SET permission = ? WHERE user_id = ?`,
        [newPermission, userId]
      );

      return result; // Returns true if at least one row was updated
    } catch (error) {
      console.error("Error updating permission in DB:", error.message);
      throw error;
    }
  }

  static async getAllPermissions() {
    try {
      const [result] = await pool.query(`SELECT id,Permission FROM Module`);
      return result;
    } catch (error) {
      console.error("Error fetching permissions from DB:", error.message);
      throw error;
    }
  }
  static async setStatusByUserId(userId, status) {
    try {
      const [result] = await pool.query(
        `UPDATE users SET status = ? WHERE user_id = ?`,
        [status, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating user status:", error.message);
      throw error;
    }
  }
  static async resetPassword(token, newPassword) {
    try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password and clear the token
      const [result] = await pool.query(
        "UPDATE users SET password = ?, reset_token = NULL WHERE reset_token = ?",
        [hashedPassword, token]
      );

      // Check if any row was affected (if the token was found and updated)
      if (result.affectedRows === 0) {
        throw new Error("Invalid or expired token");
      }

      console.log("Database update result:", result);
      return { success: true, message: "Password reset successfully" };
    } catch (error) {
      console.error("Error resetting password:", error);
      throw new Error("Error resetting password");
    }
  }
}

module.exports = UserModel;
