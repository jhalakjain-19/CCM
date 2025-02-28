const UserService = require("../services/userService");
const { validationResult } = require("express-validator");

// const { passwordResetSchema } = require("../middlewares/userValidator");

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
      //console.log(users);
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
  static async getUserById(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.user_id);
      if (!user)
        return UserController.handleResponse(res, 404, "User not found");
      UserController.handleResponse(
        res,
        200,
        "User fetched successfully",
        user
      );
    } catch (error) {
      next(error);
    }
  }
  static async deleteUser(req, res, next) {
    try {
      const deletedUser = await UserService.deleteUser(req.params.user_id);
      if (!deletedUser)
        return UserController.handleResponse(res, 404, "User not found");
      UserController.handleResponse(
        res,
        200,
        "User deleted successfully",
        deletedUser
      );
    } catch (error) {
      next(error);
    }
  }
  static async createUser(req, res) {
    try {
      const newUser = await UserService.createUser(req);
      UserController.handleResponse(
        res,
        201,
        "User and default attributes created successfully",
        newUser
      );
    } catch (error) {
      //next(error);
    }
  }
  static async updateUser(req, res, next) {
    try {
      const updatedUser = await UserService.updateUser(req.params.user_id, req);
      if (!updatedUser)
        return UserController.handleResponse(res, 404, "User not found");
      UserController.handleResponse(
        res,
        200,
        "User updated successfully",
        updatedUser
      );
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const response = await UserService.loginUser(req, req.body);

      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send({ msg: error.message });
    }
  }

  // API to change the password
  static async changePassword(req, res) {
    const { user_id } = req.params; // Assuming user_id is passed as a URL parameter
    const { currentPassword, newPassword } = req.body; // Extract passwords from request body

    // // Step 1: Validate input with Joi
    // const { error } = passwordResetSchema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ message: error.details[0].message });
    // }

    try {
      // Step 2: Call the service method to change the password
      const result = await UserService.changePassword(
        user_id,
        currentPassword,
        newPassword
      );

      // Step 3: Return success response
      return res.status(200).json({ message: result });
    } catch (error) {
      console.error("Error in UserController:", error.message);
      return res.status(500).json({ message: error.message });
    }
  }
  static async getPermissionByUserId(req, res, next) {
    try {
      const { user_id } = req.params;

      if (!user_id) {
        return res.status(400).json({ error: "User ID is required." });
      }

      const permission = await UserService.getPermissionByUserId(user_id);

      if (!permission) {
        return res
          .status(404)
          .json({ error: "No permission found for this user." });
      }

      res.status(200).json({
        message: "Permission fetched successfully",
        data: permission,
      });
    } catch (error) {
      next(error);
    }
  }
  static async setPermissionByUserId(req, res, next) {
    try {
      const { user_id } = req.params;
      const { permission } = req.body;

      if (!user_id || !permission) {
        return res
          .status(400)
          .json({ error: "User ID and permission are required." });
      }

      const isUpdated = await UserService.setPermissionByUserId(
        user_id,
        permission
      );

      if (!isUpdated) {
        return res
          .status(404)
          .json({ error: "User not found or permission not updated." });
      }

      res.status(200).json({
        message: "Permission updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllPermissions(req, res, next) {
    try {
      const permissions = await UserService.getAllPermissions();

      if (!permissions || permissions.length === 0) {
        return res.status(404).json({ error: "No permissions found." });
      }

      res.status(200).json({
        message: "Permissions fetched successfully",
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  }
  static async setStatusByUserId(req, res, next) {
    try {
      const { user_id } = req.params;
      const { status } = req.body;

      if (!user_id || status === undefined) {
        return res
          .status(400)
          .json({ error: "User ID and status are required." });
      }

      const result = await UserService.setStatusByUserId(user_id, status);

      if (!result) {
        return res
          .status(404)
          .json({ error: "User not found or update failed." });
      }

      res.status(200).json({ message: "User status updated successfully" });
    } catch (error) {
      next(error);
    }
  }
  static async forgotPassword(req, res) {
    const { Email } = req.body;
    try {
      const result = await UserService.forgotPassword(Email);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  //reset pwd
  static async resetPassword(req, res) {
    console.log("Reset password request received");
    try {
      const { reset_token } = req.params; // Get token from URL
      const { newPassword, confirmPassword } = req.body; // Get passwords from body

      // Validate that passwords are provided
      if (!newPassword || !confirmPassword) {
        return res.status(400).json({ message: "Both passwords are required" });
      }

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      // Call the service to reset the password
      const result = await UserService.resetPasswordWithToken(
        reset_token,
        newPassword
      );
      console.log("Password reset successfully");
      return res
        .status(200)
        .json({ message: "Password reset successfully", result });
    } catch (error) {
      console.error("Error resetting password:", error);
      return res.status(500).json({ message: error.message });
    }
  }
}
module.exports = UserController;
