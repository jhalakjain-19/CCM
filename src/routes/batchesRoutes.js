const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/auth.js");
const batchController = require("../controllers/batchesController.js");

/**
 * @swagger
 * /batch/create-batch:
 *   post:
 *     summary: Create a new batch
 *     tags: [Batch]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batch_name
 *             properties:
 *               batch_name:
 *                 type: string
 *               criteriaList:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     contact_field_id:
 *                       type: integer
 *                     data_type:
 *                       type: integer
 *                     criteria_from:
 *                       type: string
 *                     criteria_to:
 *                       type: string
 *                     criteria_search:
 *                       type: string
 *                     no_of_users_count:
 *                       type: integer
 *                     no_of_users:
 *                       type: string
 *             example:
 *               batch_name: "2025 Batch"
 *               criteriaList:
 *                 - contact_field_id: 1
 *                   data_type: 2
 *                   criteria_from: "A"
 *                   criteria_to: "Z"
 *                   criteria_search: "contains"
 *                   no_of_users_count: 100
 *                   no_of_users: "some list"
 *                 - contact_field_id: 2
 *                   data_type: 5
 *                   criteria_from: "10"
 *                   criteria_to: "100"
 *                   no_of_users_count: 50
 *                   no_of_users: "another list"
 *     responses:
 *       201:
 *         description: Batch created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */

router.post("/create-batch", authenticateUser, batchController.createBatch);
module.exports = router;
