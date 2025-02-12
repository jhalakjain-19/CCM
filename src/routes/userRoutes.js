const express = require("express");
const UserController = require("../controllers/userController");
const {
  validateUser,
  validateAtUpdate,
  validateLogin,
  validatePasswordReset,
} = require("../middlewares/userValidator");
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of all users
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
 *               Email:
 *                 type: string
 *               Phone_no:
 *                 type: string
 *               Password:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User creation unsuccessful
 */

router.post("/users", validateUser, UserController.createUser);

/**
 * @swagger
 * /users/{user_id}:
 *   put:
 *     summary: Update an existing user
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
router.post("/login", validateLogin, UserController.loginUser);

/**
 * @swagger
 * /users/{user_id}/change-password:
 *   put:
 *     summary: Change a user's password
 *     description: Allows a user to change their password by providing the current password and a new password.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID of the user whose password is being changed.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *
 *               newPassword:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input, password validation failed
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/users/:user_id/change-password",
  validatePasswordReset,
  UserController.changePassword
);
// //Route to get permission by user_id
// router.get(
//   "/users/getPermission/:user_id",
//   UserController.getPermissionByUserId
// );

// // Route to set permission by user ID
// router.put(
//   "/users/setPermission/:user_id",
//   UserController.setPermissionByUserId
// );
// router.get("/permissions", UserController.getAllPermissions);
/**
 * @swagger
 * /users/getPermission/{user_id}:
 *   get:
 *     summary: Get permissions by user ID
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

module.exports = router;
