const express = require("express");
const UserController = require("../controllers/userController");
const {
  validateUser,
  validateAtUpdate,
  validateLogin,
} = require("../middlewares/userValidator");
const router = express.Router();

router.get("/users", UserController.getAllUsers);

module.exports = router;