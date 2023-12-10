import config from '../config';
import { CreationAttributes } from 'sequelize';
import { ITransaction } from '../models/transactions.model';
import { Order, Transaction } from '../models';
import {orderItemsService} from "./order_items.service"
import { ModelServiceOptions } from './orders.service';
import { logger } from '../config/logger';
import { getDate } from '../utils/helper';

interface FlutterwaveResponse {
	data: {
	  link: string;
	  authorization_url: string;
	  access_code: string;
	  status:string;
	};
	status: string;
  }
  

interface InitTXPayload {
	amount: number;
	currency?: string;
	redirect_url: string;
	tx_ref: string;
	customer: {
		email: string;
		name: string;
	};
}

async function getAllTransactions(userId: string) {
	let allTransactions: any[]= [];
	await Transaction.findAll({
		include: [
			{
				model: Order,
				where: {
					customer_id: userId,
				},
				required: true,
				attributes: ['id','status','createdAt']
			},
		],
		attributes: ['id', 'amount', 'status',],
	})
		.then((transactions) => {
			transactions.map((transaction) => allTransactions.push(transaction));

			allTransactions = allTransactions.length < 1 ? [] : allTransactions.map((transaction) => ({
				id: transaction.id,
				amount: transaction.amount,
				status: transaction.status,
				orderId: transaction.order.id,
				orderStatus: transaction.order.status,
				date: getDate(transaction.order.createdAt),
			}));
			return {status:200,result: allTransactions};
		})
		.catch((error) => {
			return {status:500};
		});
		return {status:200,result: allTransactions};
}


async function getOrderTransactions(userId: string) {
	const {result} = await getAllTransactions(userId);
	const orderTransactions = result.map((item) => ({
		date: item.date,
		orderId: item.orderId,
		products: orderItemsService.getOrderItems(item.orderId),
		orderStatus: item.orderStatus
	}))
	return orderTransactions
}


async function getSingleTransaction(transactionId: string) {
	const transaction = await Transaction.findByPk(transactionId);
      return transaction;
}

async function createTransaction(
	dto: Omit<CreationAttributes<ITransaction>, 'id'>,
	options?: ModelServiceOptions
) {
	return await Transaction.create({ ...dto }, options);
}

async function initiateTransaction(
	payload: InitTXPayload,
	method: 'flutterwave' | 'paystack',
) {
	if (method === 'flutterwave') {
		return await initiateFLWTransaction(payload);
	} else {
		return await initiatePaystackTransaction(payload);
	}
}

async function initiateFLWTransaction(payload: InitTXPayload) {
	try {
		const res: any = await fetch('https://api.flutterwave.com/v3/payments', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${config.flw.secretKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				tx_ref: payload.tx_ref,
				amount: payload.amount,
				currency: payload.currency ?? 'NGN',
				redirect_url: payload.redirect_url,
				// meta: {
				// consumer_id: 23,
				// consumer_mac: "92a3-912ba-1192a"
				// },
				customer: payload.customer,
				customizations: {
					title: 'Zuri Marketplace',
					// logo: '',
				},
			}),
		});
		const response = await res.json();
		return {
			tx_url: response?.data.link as string,
			provider_ref: response?.data.link.split('/').at(-1),
		};
	} catch (err: any) {
		logger.error(err.response.body);
		return;
	}
}

async function initiatePaystackTransaction(payload: InitTXPayload) {
	try {
		const res = await fetch('https://api.paystack.co/transaction/initialize', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${config.paystack.secretKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				reference: payload.tx_ref,
				amount: payload.amount * 100,
				currency: payload.currency ?? 'NGN',
				callback_url: payload.redirect_url,
				name: payload.customer.name,
				email: payload.customer.email,
			}),
		});
		const response = await res.json() as FlutterwaveResponse;
		return {
			tx_url: response.data.authorization_url as string,
			provider_ref: response.data.access_code as string,
		};
	} catch (err: any) {
		logger.error(err.response);
		return;
	}
}


const confirmPaystackTransaction = async (txn_ref: string) => {
	const confirmationResponse = await fetch(`https://api.paystack.co/transaction/verify/${txn_ref}`,{
		method: 'GET',
		headers: {
			Authorization: `Bearer ${config.paystack.secretKey}`,
			'Content-Type': 'application/json',
		},
	})
	if (confirmationResponse.ok) {
		const responseData = await confirmationResponse.json() as FlutterwaveResponse;;
		if (responseData.data.status == "success") {
			return {status: true, message: 'success',data:responseData}
		} else {
			return {status: false, message: 'failure',data:responseData}
		}
	}else {
		return {status: false, message:"error occured" }
	}
}


const confirmFlutterwaveTransaction = async (transactionId: string) => {
	const confirmResponse = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${transactionId}`,{
		method: 'GET',
		headers: {
			Authorization: `Bearer ${config.flw.secretKey}`,
			'Content-Type': 'application/json'
		}
	})
	if (confirmResponse.ok) {
		const dataResponse = await confirmResponse.json() as FlutterwaveResponse;
		if (dataResponse.status == "error") {
			return {status: false}
		}else {
			return {status: true,data: dataResponse.data}
		}
	}
	return {status: false, message: 'failed'}
}

export const transactionsService = {
	getAllTransactions,
	getSingleTransaction,
	initiateTransaction,
	createTransaction,
	getOrderTransactions,
	confirmPaystackTransaction,
	confirmFlutterwaveTransaction
};

