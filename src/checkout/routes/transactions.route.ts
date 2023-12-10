import { Router } from 'express';
import { transactionsController } from '../controllers';
import { jwtAuth } from '../middlewares/verify';

export const transactionRouter = Router();



transactionRouter.post(
	'/orders',
	jwtAuth.verifyToken,
	transactionsController.getOrderTransactions,
);

transactionRouter.post(
	'/confirm',
	jwtAuth.verifyToken,
	transactionsController.confirmTransaction,
)

transactionRouter.get(
	'/users',
	jwtAuth.verifyToken,
	transactionsController.getAllTransactions,
);

transactionRouter.get(
	'/:transactionId',
	jwtAuth.verifyToken,
	transactionsController.getSingleTransaction,
);


/** SWAGGER DOCS */

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API endpoints for managing transactions
 */

/**
 * @swagger
 * /api/checkout/api/transactions:
 *   get:
 *     summary: Fetch All Transactions For a User
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Succesful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/checkout/api/transactions/{transactionId}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     description: Retrieve a transaction by its unique ID.
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the transaction to retrieve.
 *     responses:
 *       200:
 *         description: Successful response with the transaction data.
 *       404:
 *         description: Transaction not found.
 */
