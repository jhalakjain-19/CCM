const express = require("express");
const CustomerController = require("../controllers/customerController");
const authenticateUser = require("../middlewares/auth");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Customers
 *     description: API for customer management
 */

/**
 * @swagger
 * /customer/attr-types:
 *   get:
 *     summary: Get all attribute types
 *     description: Fetches all attribute types from the database.
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Successfully retrieved attribute types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   generic_value_id:
 *                     type: integer
 *                     example: 1
 *                   generic_key:
 *                     type: string
 *                     example: "Attr"
 *                   generic_value:
 *                     type: string
 *                     example: "Attribute Type"
 *                   description:
 *                     type: string
 *                     example: "standard"
 *                   status:
 *                     type: integer
 *                     example: 1
 *                   created_on:
 *                     type: string
 *                     format: date-time
 */
// Router to get all attribute types
router.get("/attr-types", CustomerController.getAttrTypes);

/**
 * @swagger
 * /customer/data-types:
 *   get:
 *     summary: Get all data types
 *     description: Fetches all data types from the database.
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Successfully retrieved data types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   generic_value_id:
 *                     type: integer
 *                     example: 4
 *                   generic_key:
 *                     type: string
 *                     example: "DataType"
 *                   generic_value:
 *                     type: string
 *                     example: "Data Type"
 *                   description:
 *                     type: string
 *                     example: "text"
 *                   status:
 *                     type: integer
 *                     example: 1
 *                   created_on:
 *                     type: string
 *                     format: date-time
 */
// Router to get all data types
router.get("/data-types", CustomerController.getDataTypes);

/**
 * @swagger
 * /customer/create-attribute:
 *   post:
 *     summary: Create a new attribute
 *     description: This API allows an authenticated user to create an attribute in the customer_details table.
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field_name
 *               - data_type
 *               - attribute_type
 *             properties:
 *               field_name:
 *                 type: string
 *                 example: "first_name"
 *                 description: The name of the attribute.
 *               data_type:
 *                 type: integer
 *                 example: 8
 *                 description: The data type of the attribute.
 *               attribute_type:
 *                 type: integer
 *                 example: 1
 *                 description: The type of attribute.
 *     responses:
 *       201:
 *         description: Attribute created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Attribute created successfully"
 *                 id:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Bad request - Missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user_id, field_name, data_type, and attribute_type are required"
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

// Create an attribute name
// router.post("/create-attribute", CustomerController.createAttribute);
router.post(
  "/create-attribute",
  authenticateUser,
  CustomerController.createAttribute
);

/**
 * @swagger
 * /customer/get-attributes:
 *   get:
 *     summary: Get all attributes
 *     description: Fetches all attributes from the customer details table.
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Successfully retrieved attributes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   contact_field_id:
 *                     type: integer
 *                     example: 1
 *                   customer_id:
 *                     type: integer
 *                     example: 101
 *                   field_name:
 *                     type: string
 *                     example: "Phone"
 *                   data_type:
 *                     type: string
 *                     example: "number"
 *                   attribute_type:
 *                     type: string
 *                     example: "transaction"
 *                   status:
 *                     type: integer
 *                     example: 1
 *                   created_on:
 *                     type: string
 *                     format: date-time
 */
// Get all attribute names
router.get("/get-attributes", CustomerController.getAttributes);

/**
 * @swagger
 *  /customer/delete-attribute/{contact_field_id}:
 *   delete:
 *     summary: Delete an attribute by contact_field_id
 *     description: Deletes an attribute from the customer_details table using the provided contact_field_id.
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: contact_field_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the attribute to be deleted.
 *     responses:
 *       200:
 *         description: Attribute deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Attribute deleted successfully"
 *       400:
 *         description: Bad request - contact_field_id is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "contact_field_id is required"
 *       404:
 *         description: Attribute not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Attribute not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

//Route to delete attribute_name by id
router.delete(
  "/delete-attribute/:contact_field_id",
  CustomerController.deleteAttribute
);
//Route for import file
router.post(
  "/import-csv",
  authenticateUser,
  upload.single("file"),
  CustomerController.importCsv
);

module.exports = router;
