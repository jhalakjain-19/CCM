const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");
// Route to set permission by user ID
router.put(
  "/users/setPermission/:user_id",
  permissionController.setPermissionByUserId
);
