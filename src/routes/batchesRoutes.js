const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/auth.js");
const batchController = require("../controllers/batchesController.js");

/**
 * @swagger
 * /batch/create-batch:
 *   post:
 *     summary: Create a new batch based on criteria
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
 *               - criteriaList
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
 *     responses:
 *       201:
 *         description: Batch created successfully
 *       400:
 *         description: Missing batch_name or criteriaList
 *       500:
 *         description: Internal server error
 */

router.post("/create-batch", authenticateUser, batchController.createBatch);
module.exports = router;
