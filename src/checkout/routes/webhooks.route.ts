import { Router } from 'express';
import {
	webhooksController,
} from '../controllers/webhooks.controller';

export const webhookRouter = Router();

webhookRouter.post(
	'/flw',
	webhooksController.confirmFlwTx,
);

webhookRouter.post(
	'/paystack',
	webhooksController.confirmPaystackTx,
);

webhookRouter.post(
	'/test-order-completed/:orderId',
	webhooksController.testOrderCompleted,
);

/**
 * @swagger
 * tags:
 *   name: Webhooks
 *   description: API endpoints for payment confirmation webhooks
 */

/**
 * @swagger
 * /api/checkout/api/webhooks/flw:
 *   post:
 *     summary: confirm flutterwave transaction
 *     tags: [Webhooks]
 *     parameters:
 *       - in: header
 *         name: verif-hash
 *         schema:
 *           type: string
 *         required: true
 *         example: h297hd27e2ge2ediudcdiusc98hde9fhuenweufhw9e8
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 example: charge.completed
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 01234
 *                   tx_ref:
 *                     type: string
 *                     example: Zuri-tx-1697027556476
 *                   flw_ref:
 *                     type: string
 *                     example: b9583b59120d46e3764b
 *                   status:
 *                     type: string
 *                     example: successful
 *                   amount:
 *                     type: number
 *                     example: 25.7397
 *                   currency:
 *                     type: string
 *                     example: NGN
 *     responses:
 *       200:
 *         description: User transaction confirmed or failed.
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *             example: Transaction confirmed
 *
 */

/**
 * @swagger
 * /api/checkout/api/webhooks/paystack:
 *   post:
 *     summary: confirm paystack transaction
 *     tags: [Webhooks]
 *     parameters:
 *       - in: header
 *         name: x-paystack-signature
 *         schema:
 *           type: string
 *         required: true
 *         example: 77bd2aea0b48a6accf098cd977c95b673208f733b61571e9a3489606ab7d63e7ab38734951f577ebadcf6df7782372c408b9137dd0dc74769c0ac2d4f74bbddc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 example: paymentrequest.success
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 0123
 *                   domain:
 *                     type: string
 *                     example: test
 *                   reference:
 *                     type: string
 *                     example: Zuri-tx-1696889120651
 *                   status:
 *                     type: string
 *                     example: success
 *                   amount:
 *                     type: number
 *                     example: 25.7397
 *                   currency:
 *                     type: string
 *                     example: NGN
 *     responses:
 *       200:
 *         description: User transaction confirmed or failed.
 *
 */

// {
// 	"event": "paymentrequest.success",
// 	"data": {
// 	  "id": 0123,
// 	  "domain": "test",
// 	  "reference": "Zuri-tx-1696889120651",
// 	  "status": "success",
// 	  "amount": 25.7397,
// 	  "currency": "NGN"
// 	}
//   }