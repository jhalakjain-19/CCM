const express = require("express");
const CustomerController = require("../controllers/customerController");
const authenticateUser = require("../middlewares/auth");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Customers
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
 *               custom_options_value:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["option1", "option2", "option3"]
 *                 description: Required when data_type is 8, stores comma-separated values.
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
 *     summary: Get attributes for the logged-in user
 *     description: Fetches attributes from the customer details table for the authenticated user.
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []  # Requires Bearer Token authentication
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
 *                     example: 27
 *                   user_id:
 *                     type: integer
 *                     example: 119
 *                   field_name:
 *                     type: string
 *                     example: "email"
 *                   data_type:
 *                     type: integer
 *                     example: 7
 *                   attribute_type:
 *                     type: integer
 *                     example: 1
 *                   status:
 *                     type: integer
 *                     example: 1
 *                   created_on:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-28 15:35:34"
 *       400:
 *         description: User ID is required
 *       401:
 *         description: Unauthorized - No token or invalid token
 *       500:
 *         description: Internal Server Error
 */

// Get all attribute names
// router.get("/get-attributes", CustomerController.getAttributes);
router.get(
  "/get-attributes",
  authenticateUser,
  CustomerController.getAttributes
);

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
  authenticateUser,
  CustomerController.deleteAttribute
);
//Route for import file
/**
 * @swagger
 * /customer/import-csv:
 *   post:
 *     summary: Import customer data from CSV
 *     description: Uploads and processes a CSV file to import customer data.
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []  # Requires Bearer Token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The CSV file to be uploaded
 *     responses:
 *       200:
 *         description: File successfully imported
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File imported successfully"
 *       400:
 *         description: Bad Request - Invalid file format or missing file
 *       401:
 *         description: Unauthorized - No token or invalid token
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/import-csv",
  authenticateUser,
  upload.single("file"),
  CustomerController.importCsv
);

//route to delete a record row for a user
/**
 * @swagger
 * /customer/delete-records:
 *   delete:
 *     summary: Delete multiple records by row numbers for a specific user
 *     description: Deletes multiple records from the database based on provided row numbers for the authenticated user.
 *     tags:
 *       - Customers
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               row_numbers:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 5]
 *     responses:
 *       200:
 *         description: Records deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Records deleted successfully."
 *       400:
 *         description: Invalid row numbers provided.
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid row numbers."
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized."
 *       404:
 *         description: One or more records not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Some records were not found."
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error."
 */
router.delete(
  "/delete-records",
  authenticateUser,
  CustomerController.deleteMultipleRecords
);

//route to delete all records
/**
 * @swagger
 * /customer/delete-all-records:
 *   delete:
 *     summary: Delete all records for a specific user
 *     description: Deletes all customer data rows for the authenticated user.
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All records deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All records deleted successfully."
 *       404:
 *         description: No records found to delete.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No records found to delete."
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
router.delete(
  "/delete-all-records",
  authenticateUser,
  CustomerController.deleteAllRecords
);

//show imported data for a user
/**
 * @swagger
 * /customer/get-user-records:
 *   get:
 *     summary: Get all customer details along with field names for a particular user
 *     description: Fetches all customer records along with field names for a given user.
 *     tags:
 *       - Customers
 *     security:
 *       - BearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Successfully retrieved user records.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fields:
 *                   type: array
 *                   items:
 *                     type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No records found for this user.
 *       500:
 *         description: Internal Server Error.
 */
router.get(
  "/get-user-records",
  authenticateUser,
  CustomerController.getAllUserRecords
);

//set order_no of attributes
/**
 * @swagger
 * /customer/set-order/{contact_field_id}:
 *   put:
 *     summary: Update order number for a specific contact field and authenticated user
 *     description: Updates the order_no of a specific contact_field_id for the authenticated user.
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contact_field_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the contact field to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_no
 *             properties:
 *               order_no:
 *                 type: integer
 *                 example: 2
 *                 description: The new order number.
 *     responses:
 *       200:
 *         description: Order number updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order number updated successfully"
 *       400:
 *         description: Bad request - Missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "order_no is required"
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
 *       404:
 *         description: Not Found - No matching record found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No matching record found"
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

router.put(
  "/set-order/:contact_field_id",
  authenticateUser,
  CustomerController.setOrder
);
module.exports = router;
