import { Router } from 'express';
import { ordersController } from '../controllers';
import { auth } from '../middlewares/auth';
import { jwtAuth } from '../middlewares/verify';
import validate from '../middlewares/validate';
import { orderValidation } from '../validation';

export const orderRouter = Router();

orderRouter.post(
	'/',
	jwtAuth.verifyToken,
	validate(orderValidation.createOrder),
	ordersController.createOrder,
);
orderRouter.get(
	'/',
	jwtAuth.verifyToken,
	auth(),
	ordersController.getUserOrders,
);
orderRouter.get(
	'/:orderId',
	jwtAuth.verifyToken,
	ordersController.getOrderById,
);
orderRouter.get(
	'/order-items/:orderId',
	jwtAuth.verifyToken,
	ordersController.getOrderItemsByOrderId,
);
orderRouter.put('/confirm/:orderId',
	jwtAuth.verifyToken,
	validate(orderValidation.confirmOrder),
	ordersController.confirmOrder);
orderRouter.get(
	'/merchants/:merchantId/summary',
	jwtAuth.verifyToken,
	ordersController.orderSummaryPerMerchant,
);

/** SWAGGER DOCS */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing orders
 */

/**
 * @swagger
 * /api/checkout/api/orders:
 *   post:
 *     summary: Place and order and initiate payment
 *     tags: [Orders]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               redirect_url:
 *                 type: string
 *                 required: true
 *                 example: "https://localhost:3001"
 *               payment_method:
 *                 type: string
 *                 required: true
 *                 example: "flutterwave"
 *     responses:
 *       201:
 *         description: Succesful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction_url:
 *                   type: string
 *       500:
 *         description: Internal Error
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /api/checkout/api/Orders/{orderId}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     description: Retrieve an order by its unique ID.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to retrieve.
 *     responses:
 *       200:
 *         description: Successful response with the order data.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/checkout/api/orders:
 *   put:
 *     summary: Confirm an order
 *     tags: [Orders]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 required: true
 *                 example: "d7853ae1-cb46-4d09-a87e-70c858d45cd7"
 *               transactionStatus:
 *                 type: string
 *                 required: true
 *                 example: "success"
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     orderId:
 *                       type: string
 *                     subtotal:
 *                       type: string
 *                     VAT:
 *                       type: string
 *                     discount:
 *                       type: string
 *                     status:
 *                       type: string
 *       500:
 *         description: Internal Error
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
