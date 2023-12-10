import crypto from 'crypto';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../config';
import { Transaction } from '../models';
import { TransactionStatus } from '../models/transactions.model';
import ApiError from '../utils/ApiError';
import { PayStackHookRes } from '../utils/types/paystack-hook-response';
import { WebHookPayload } from '../utils/types/webhook-payload';
import { ordersService } from './orders.service';
import { OrderCompletedPublisher } from '../events/publishers/order-completed.publisher';
import { amqpWrapper } from '../utils/amqpWrapper';
import { logger } from '../config/logger';

async function confirmFlwTx(req: Request, res: Response) {
	const secretHash = config.flw.secretHash;
	const signature = req.headers['verif-hash'];
	if (!signature || signature !== secretHash) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
	}
	const data: WebHookPayload['data'] = req.body;

	const transaction = await Transaction.findOne({
		where: { in_app_ref: data.txRef },
	});
	if (!transaction) throw new ApiError(httpStatus.NOT_FOUND, "Transaction not found");

	if (
		transaction.amount == data.amount &&
		transaction.currency == data.currency
	) {
		if (data.status === 'successful') {
			transaction.status = TransactionStatus.success;
			const { id } = await ordersService.confirmOrder(data.txRef);
			new OrderCompletedPublisher(amqpWrapper.channel).publish({ orderId: id });
		} else {
			transaction.status = TransactionStatus.failed;
			await ordersService.orderFailed(data.txRef);
		}
		await transaction.save();
		logger.info('Transaction updated');
		return res.status(httpStatus.OK).end();
	} else {
		logger.error('Transaction data is NOT VALID');
		return res.status(httpStatus.BAD_REQUEST).end();
	}
}

async function confirmPaystackTx(req: Request, res: Response) {
	const secretHash = config.paystack.secretKey;
	const hash = crypto
		.createHmac('sha512', secretHash)
		.update(JSON.stringify(req.body))
		.digest('hex');
	if (hash != req.headers['x-paystack-signature']) throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");

	const { data }: PayStackHookRes = req.body;
	const transaction = await Transaction.findOne({
		where: { in_app_ref: data.reference },
	});
	if (!transaction) throw new ApiError(httpStatus.NOT_FOUND, "Transaction not found");

	if (
		`${transaction.amount}` == (+data.amount / 100).toFixed(2) &&
		transaction.currency == data.currency
	) {
		if (data.status === 'success') {
			transaction.status = TransactionStatus.success;
			const { id } = await ordersService.confirmOrder(data.reference);
			new OrderCompletedPublisher(amqpWrapper.channel).publish({ orderId: id });
		} else {
			transaction.status = TransactionStatus.failed;
			await ordersService.orderFailed(data.reference);
		}
		await transaction.save();
		logger.info('Transaction updated');
		return res.status(httpStatus.OK).end();
	} else {
		logger.error('Transaction data is NOT VALID');
		return res.status(httpStatus.BAD_REQUEST).end();
	}
}

export const webhooksService = {
	confirmFlwTx,
	confirmPaystackTx,
};
