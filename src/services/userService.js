const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const crypto = require("crypto");
const sendMail = require("../utils/mailer");
class UserService {
  // Encrypt function to encrypt reset token with a shorter length
  static async encryptId(id) {
    const secretKey = crypto
      .createHash("sha256")
      .update(process.env.SECRET_KEY)
      .digest("base64")
      .substr(0, 16); // Use 16 bytes for aes-128-cbc

    if (!secretKey) throw new Error("Missing secret key for encryption");

    // Generate a random 16-byte IV
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      "aes-128-cbc",
      Buffer.from(secretKey),
      iv
    );

    let encrypted = cipher.update(String(id), "utf8", "base64");
    encrypted += cipher.final("base64");

    // Concatenate IV with encrypted data and encode to base64 URL-safe format
    const result = Buffer.concat([iv, Buffer.from(encrypted, "base64")])
      .toString("base64")
      .replace(/=/g, "") // Remove padding
      .replace(/\+/g, "-") // Make URL-safe
      .replace(/\//g, "_");

    return result;
  }

  // Decrypt function to decrypt the token
  static async decryptId(encryptedId) {
    const secretKey = crypto
      .createHash("sha256")
      .update(process.env.SECRET_KEY)
      .digest("base64")
      .substr(0, 16); // Use 16 bytes for aes-128-cbc

    if (!secretKey) throw new Error("Missing secret key for decryption");

    // Convert URL-safe Base64 back to standard Base64
    const encryptedData =
      encryptedId.replace(/-/g, "+").replace(/_/g, "/") +
      "==".slice(0, (4 - (encryptedId.length % 4)) % 4);

    const encryptedBuffer = Buffer.from(encryptedData, "base64");
    const iv = encryptedBuffer.slice(0, 16); // Extract IV
    const encryptedText = encryptedBuffer.slice(16); // Encrypted data

    const decipher = crypto.createDecipheriv(
      "aes-128-cbc",
      Buffer.from(secretKey),
      iv
    );

    let decrypted = decipher.update(encryptedText, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

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
  static async forgotPassword(email) {
    try {
      // Find user by email
      const user = await UserModel.getUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      console.log("User found:", user.Email);

      // Generate reset token
      const resetToken = await UserModel.generateResetToken(user);

      // Encrypt the reset token with a shorter length
      const encryptedToken = await this.encryptId(resetToken);
      console.log(encryptedToken);
      // Construct the reset link with the encrypted token
      const resetLink = `http://localhost:1106/api/password/reset-password/${encryptedToken}`;

      console.log(resetLink);

      const subject = "Password Reset Request";
      const content = `
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you didn't request this, please ignore it.</p>
      `;

      // Send email
      await sendMail(email, subject, resetLink);

      return { message: "Password reset email sent successfully" };
    } catch (error) {
      return { error: error.message };
    }
  }
  static async resetPasswordWithToken(token, newPassword) {
    try {
      // Decrypt the token before validating
      const decryptedToken = await this.decryptId(token);

      // Validate token and reset password
      await UserModel.resetPassword(decryptedToken, newPassword);

      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }
}

module.exports = UserService;
