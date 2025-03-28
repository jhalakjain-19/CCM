const express = require("express");
const UserController = require("../controllers/userController");
const {
  validateUser,
  validateAtUpdate,
  validateLogin,
  validatePasswordReset,
} = require("../middlewares/userValidator");
const router = express.Router();
const authenticateUser = require("../middlewares/auth");
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags:
 *      - Users
 *     description: Get all users from the database.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   Name:
 *                     type: string
 *                   Email:
 *                     type: string
 */
router.get("/users", UserController.getAllUsers);

/**
 * @swagger
 * /users/{user_id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags:
 *     - Users
 *     description: Get a specific user from the database by ID.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The user's ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 Name:
 *                   type: string
 *                 Email:
 *                   type: string
 */
router.get("/users/:user_id", UserController.getUserById);

/**
 * @swagger
 * /users/{user_id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *      - Users
 *     description: Delete a specific user from the database by ID.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The user's ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       404:
 *         description: User not found
 */
router.delete("/users/:user_id", UserController.deleteUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     description: Create a new user in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 example: "John Doe"
 *               Email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               Phone_no:
 *                 type: string
 *                 pattern: "^[0-9]{10,15}$"
 *                 example: "9876543210"
 *               Password:
 *                 type: string
 *                 format: password
 *                 example: "securepassword123"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 123
 *                 message:
 *                   type: string
 *                   example: "User created successfully."
 *       400:
 *         description: Bad request (validation errors)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User creation unsuccessful."
 *       409:
 *         description: Conflict (Email already in use)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email is already in use."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong. Please try again later."
 */

router.post("/users", validateUser, UserController.createUser);

/**
 * @swagger
 * /users/{user_id}:
 *   put:
 *     summary: Update an existing user
 *     tags:
 *      - Users
 *     description: Update a user's details in the database.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The user's ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Phone_no:
 *                 type: string
 *
 *
 *
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put("/users/:user_id", validateAtUpdate, UserController.updateUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Users
 *     description: Authenticate a user and return a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login with token
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validateLogin, UserController.login);

// /**
//  * @swagger
//  * /users/{user_id}/change-password:
//  *   put:
//  *     summary: Change a user's password
//  *     tags:
//  *      - Users
//  *     description: Allows a user to change their password by providing the current password and a new password.
//  *     parameters:
//  *       - in: path
//  *         name: user_id
//  *         required: true
//  *         description: ID of the user whose password is being changed.
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               currentPassword:
//  *                 type: string
//  *
//  *               newPassword:
//  *                 type: string
//  *
//  *     responses:
//  *       200:
//  *         description: Password changed successfully
//  *       400:
//  *         description: Invalid input, password validation failed
//  *       404:
//  *         description: User not found
//  *       500:
//  *         description: Internal server error
//  */
// router.put(
//   "/users/:user_id/change-password",
//   validatePasswordReset,
//   UserController.changePassword
// );

/**
 * @swagger
 * /users/getPermission/{user_id}:
 *   get:
 *     summary: Get permissions by user ID
 *     tags:
 *      - Users
 *     description: Retrieve the permissions assigned to a specific user.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The user's ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved user permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Bad request, missing or invalid user ID
 *       404:
 *         description: No permissions found for this user
 */
router.get(
  "/users/getPermission/:user_id",
  UserController.getPermissionByUserId
);
/**
 * @swagger
 * /users/setPermission/{user_id}:
 *   put:
 *     summary: Set permissions for a user ID
 *     tags:
 *      - Users
 *     description: Assign or update permissions for a specific user by user ID.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The user's ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permission:
 *                 type: string
 *                 items:
 *                   type: integer
 *                 example: "1,3"
 *     responses:
 *       200:
 *         description: User permissions updated successfully
 *       400:
 *         description: Invalid request or missing data
 *       404:
 *         description: User not found
 */
router.put(
  "/users/setPermission/:user_id",
  UserController.setPermissionByUserId
);
/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Get all permissions
 *     tags:
 *      - Users
 *     description: Retrieve a list of all available permissions from the modules table.
 *     responses:
 *       200:
 *         description: Successfully retrieved all permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       Permission:
 *                         type: string
 *                       status:
 *                         type: integer
 *       404:
 *         description: No permissions found
 */
router.get("/permissions", UserController.getAllPermissions);
//Route to set status by user_id
/**
 * @swagger
 * /users/setStatus/{user_id}:
 *   put:
 *     summary: Update user status
 *     tags:
 *      - Users
 *     description: Set or update the status of a specific user.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The user's ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Invalid request, missing user ID or status
 *       404:
 *         description: User not found
 */

router.put("/users/setStatus/:user_id", UserController.setStatusByUserId);
//route for forgot password
/**
 * @swagger
 * /users/forgotpassword:
 *   post:
 *     summary: Request a password reset
 *     description: Sends a password reset link to the user's email address.
 *     tags:
 *      - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Email
 *             properties:
 *               Email:
 *                 type: string
 *                 format: Email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset email sent successfully"
 *       400:
 *         description: Bad request (missing email)
 *       500:
 *         description: Internal Server Error
 */
router.post("/users/forgotpassword", UserController.forgotPassword);

//route for reset password
/**
 * @swagger
 * /users/reset-password/{reset_token}:
 *   post:
 *     summary: Reset password using the token
 *     description: Allows a user to reset their password using a valid token.
 *     tags:
 *      - Users
 *     parameters:
 *       - in: path
 *         name: reset_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token received via email for password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully"
 *       400:
 *         description: Bad request (passwords do not match or missing fields)
 *       404:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal Server Error
 */

router.post("/users/reset-password/:reset_token", UserController.resetPassword);
//get details of logged in user
/**
 * @swagger
 * /user-details:
 *   get:
 *     summary: Get user details of logged in
 *     description: Fetches details of the authenticated user based on the JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []  # Requires JWT Token
 *
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User details fetched successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     Name:
 *                       type: string
 *                       example: John Doe
 *                     Email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     Phone_no:
 *                       type: string
 *                       example: "+1234567890"
 *                     status:
 *                       type: integer
 *                       example: 1
 *                     created_on:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T12:00:00Z"
 *       400:
 *         description: User ID is required
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/user-details", authenticateUser, UserController.getUserDetails);

//create user by admin api
/**
 * @swagger
 * /user-by-admin:
 *   post:
 *     summary: Create a new user by admin
 *     description: Admin can create a new user, assign packages, and a password reset email will be sent to the user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []  # If authentication is required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Name
 *               - Email
 *               - Phone_no
 *               - Packages
 *             properties:
 *               Name:
 *                 type: string
 *                 example: "John Doe"
 *               Email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               Phone_no:
 *                 type: string
 *                 pattern: "^[0-9]{10,15}$"
 *                 example: "9876543210"
 *               Packages:
 *                 type: string
 *                 description: "Comma-separated list of package IDs"
 *                 example: "1,4"
 *     responses:
 *       201:
 *         description: User created successfully, and password reset email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 123
 *                 message:
 *                   type: string
 *                   example: "User created successfully. Password reset email sent."
 *       400:
 *         description: Bad request (validation errors)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email is already in use."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong. Please try again later."
 */
router.post("/user-by-admin", UserController.createUserByAdmin);
module.exports = router;
