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
 *             example:
 *               batch_name: "2025 Batch"
 *     responses:
 *       201:
 *         description: Batch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 batchId:
 *                   type: integer
 *                 batchCode:
 *                   type: integer
 *               example:
 *                 message: Batch created successfully
 *                 batchId: 5
 *                 batchCode: 5
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/create-batch", authenticateUser, batchController.createBatch);
module.exports = router;
