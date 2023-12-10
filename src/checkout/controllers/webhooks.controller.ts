import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AnyZodObject, ZodError } from 'zod';
import { messagingService, webhooksService } from '../services';
import Asyncly from '../utils/Asyncly';
import { orderAlert } from '../services/order-alert.service';
import { activityService } from '../services/activity.service';

const confirmFlwTx = Asyncly(async (req, res) => {
	await webhooksService.confirmFlwTx(req, res);
});

const confirmPaystackTx = Asyncly(async (req, res) => {
	await webhooksService.confirmPaystackTx(req, res);
});

const testOrderCompleted = Asyncly(async (req, res) => {
	const { orderId } = req.params;
	await orderAlert.orderAlertService(orderId);
    await messagingService.buyerOrderConfirmation(orderId);
    await messagingService.sellerOrderConfirmation(orderId);
    await messagingService.sellerPurchaseConfirmation(orderId);
    await messagingService.buyerPurchaseConfirmation(orderId);
    await activityService.recordActivity(orderId);
	res.end();
});

export const webhooksController = {
	confirmFlwTx,
	confirmPaystackTx,
	testOrderCompleted
};

export const webHookPayloadValidation = (headerSchema: AnyZodObject, schema: AnyZodObject) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await headerSchema.parseAsync(req.headers);
			await schema.parseAsync(req.body);
			next();
		} catch (err) {
			if (err instanceof ZodError) {
				err = err.issues.map((e) => ({ [e.path[1]]: e['message'] }));
				return res.status(httpStatus.BAD_REQUEST).json({ error: err });
			}
			return res.status(httpStatus.BAD_REQUEST).json({ error: 'failed' });
		}
	};
