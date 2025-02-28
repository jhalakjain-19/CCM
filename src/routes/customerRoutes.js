const express = require("express");
const CustomerController = require("../controllers/customerController");
const authenticateUser = require("../middlewares/auth");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Customers
 *     description: API for customer attribute management
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
 *     description: Adds a new attribute to the customer details table.
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - field_name
 *               - data_type
 *               - attribute_type
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 101
 *               field_name:
 *                 type: string
 *                 example: "Phone"
 *               data_type:
 *                 type: string
 *                 example: "number"
 *               attribute_type:
 *                 type: string
 *                 example: "transaction"
 *               status:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Attribute created successfully
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
 *                   example: 123
 *       400:
 *         description: Bad request, missing fields
 *       500:
 *         description: Internal Server Error
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

//Route to delete attribute_name by id
router.delete(
  "/delete-attribute/:contact_field_id",
  CustomerController.deleteAttribute
);
module.exports = router;
