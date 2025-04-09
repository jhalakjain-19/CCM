const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/auth.js");
const batchController = require("../controllers/batchesController.js");
/**
 * @swagger
 * components:
 *   schemas:
 *     CreateBatchRequest:
 *       type: object
 *       required:
 *         - batch_name
 *       properties:
 *         batch_name:
 *           type: string
 *           description: The name of the batch
 *
 *       example:
 *         batch_name: "April 2025 Batch"
 *
 *     CreateBatchResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         batchId:
 *           type: integer
 *         batchCode:
 *           type: integer
 *       example:
 *         message: Batch created successfully
 *         batchId: 5
 *         batchCode: 5
 */
/**
 * @swagger
 * /batch/create-batch:
 *   post:
 *     summary: Create a new batch
 *     tags: [Batch]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBatchRequest'
 *     responses:
 *       201:
 *         description: Batch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBatchResponse'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/create-batch", batchController.createBatch);
module.exports = router;
