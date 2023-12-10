import axios from 'axios';
import { ordersService } from './orders.service';
import { userService } from './user.service';
import { orderItemsService } from './order_items.service';
import { logger } from '../config/logger';
import { IOrderItem } from '../models/order_items.model';
import { getDate } from '../utils/helper';
import config from '../config';
import { Transaction } from '../models';

async function buyerOrderConfirmation(orderid: string) {
	const endpointURL = `${config.messaging_url}/order/buyer-order-confirmation`;

	const order = await ordersService.getOrderById(orderid);
	if (!order) return logger.error("Order not found!");
	const orderItems = await orderItemsService.getOrderItems(orderid);
	const customer = await userService.findUserById(order.customer_id);
	if (!customer) return logger.error("Customer not found!");

	const message = {
		recipient: customer.email,
		name: customer.first_name,
		order_details: {
			order_id: orderid,
			items: orderItems.map(item => ({
				"image_link": item.product?.productImage?.url,
				"item_name": item.product?.name,
				"item_price": Number(item.order_price)
			})),
			subtotal: Number(order.subtotal),
			discount_percentage: Number(order.discount),
			shipping: Number(order.VAT),
			total: Number(order.subtotal) - Number(order.discount) + Number(order.VAT),
		},
		billing_information: {
			email: customer.email,
			name: `${customer.first_name} ${customer.last_name}`,
		},
	};
	sendmail(endpointURL, message);
}

async function sellerOrderConfirmation(orderid: string) {
	const endpointURL = `${config.messaging_url}/order/seller-order-confirmation`;
	const orderItems = await orderItemsService.getOrderItems(orderid);
	const merchantGrouping = groupByMerchant(orderItems);
	Object.values(merchantGrouping).forEach((setOfItems) => {
		const merchant = setOfItems[0]?.merchant;
		const customer = setOfItems[0]?.customer;
		const summary = getOrderItemsSummary(setOfItems);
		const message = {
			recipient: merchant?.email,
			name: merchant?.first_name,
			call_to_action_link: config.baseUrl, // NO endpoint to confirm order
			order_details: {
				order_id: orderid,
				items: setOfItems.map(item => ({
					"image_link": item.product?.productImage?.url,
					"item_name": item.product?.name,
					"item_price": Number(item.order_price)
				})),
				subtotal: summary.subtotal,
				discount_percentage: summary.discount,
				shipping: summary.VAT,
				total: summary.total,
			},
			billing_information: {
				name: `${customer?.first_name} ${customer?.last_name}`,
				email: customer?.email,
			},
		};
		sendmail(endpointURL, message);
	})
}

async function sellerPurchaseConfirmation(orderid: string) {
	const endpointURL = `${config.messaging_url}/order/seller-purchase-confirmation`;
	const orderItems = await orderItemsService.getOrderItems(orderid);
	const merchantGrouping = groupByMerchant(orderItems);
	Object.values(merchantGrouping).forEach((setOfItems) => {
		const merchant = setOfItems[0]?.merchant;
		const customer = setOfItems[0]?.customer;
		const summary = getOrderItemsSummary(setOfItems);
		const message = {
			recipient: merchant?.email,
			name: merchant?.first_name,
			call_to_action_link: config.baseUrl, // base_url
			order_details: {
				order_id: orderid,
				order_date: getDate(setOfItems[0]?.createdAt || new Date().toISOString()),
				total_amount: summary.total,
				items: setOfItems.map(item => ({
					image_link: item.product?.productImage?.url,
					course_title: item.product?.name,
					instructor: `${merchant?.first_name} ${merchant?.last_name}`,
					access_link: item.product?.assets?.link || config.baseUrl,
					amount: Number(item.order_price)
				})),
			},
			buyer_information: {
				name: `${customer?.first_name} ${customer?.last_name}`,
				email: customer?.email,
			},
			earnings_summary: {
				total_earnings: summary.total,
				net_earnings: summary.total
			},
			payment_date: getDate(setOfItems[0]?.createdAt || new Date().toISOString()),
			support_contact: config.customerSupport
		};
		sendmail(endpointURL, message);
	})
}

async function buyerPurchaseConfirmation(orderId: string) {
	const endpointURL = `${config.messaging_url}/order/buyer-purchase-confirmation`;

	const order = await ordersService.getOrderById(orderId);
	if (!order) return logger.error("Order not found!");
	const transaction = await Transaction.findOne({ where: { order_id: orderId } });
	if (!transaction) return logger.error("Transaction not found!");
	const customer_id = order.customer_id;
	const user = await userService.findUserById(customer_id);
	if (!user) return logger.error("Customer not found!");
	const orderItems = await orderItemsService.getOrderItems(orderId);

	const buyerConfirmationMessage = {
		recipient: user.email,
		name: user.first_name,
		order_details: {
			order_id: orderId,
			order_date: getDate(order.createdAt as string),
			total_amount: +order.subtotal - +order.discount + +order.VAT,
			items: orderItems.map(item => ({
				"image_link": item.product?.productImage?.url,
				"course_title": item.product?.name,
				"instructor": item.merchant?.first_name,
				"access_link": item.product?.assets?.link || config.baseUrl,
				"amount": Number(item.order_price)
			})),
		},
		billing_information: {
			name: `${user.first_name} ${user.last_name}`,
			email: user.email,
			payment_method: transaction?.provider ?? 'Zuri Portfolio'
		}
	}
	sendmail(endpointURL, buyerConfirmationMessage);
}

export const messagingService = {
	buyerOrderConfirmation,
	sellerOrderConfirmation,
	sellerPurchaseConfirmation,
	buyerPurchaseConfirmation
};


// HELPER FUNCTIONS
async function sendmail(endpointURL: string, message: Record<string, any>) {
	try {
		const response = await axios.post(endpointURL, message);
		logger.info('Message sent successfully.');
	} catch (error: any) {
		if (error.response.status == 422) return logger.error(`error:${JSON.stringify(error.response.data, null, 2)}`)
		logger.error('Error sending the message:', error);
	}
}

function groupByMerchant(orderItems: IOrderItem[]) {
	const merchantGrouping = {} as Record<string, IOrderItem[]>;
	orderItems.forEach(item => {
		const merchantId = item.merchant_id
		if (!Object.hasOwn(merchantGrouping, merchantId)) {
			merchantGrouping[merchantId] = [item]
		} else {
			merchantGrouping[merchantId].push(item)
		}
	})
	return merchantGrouping
}

function getOrderItemsSummary(orderItems: IOrderItem[]) {
	return orderItems.reduce((sumObj, orderItem) => {
		const subtotal = Number(orderItem.order_price);
		const discount = Number(orderItem.order_discount);
		const VAT = (Number(orderItem.order_VAT) / 100) * subtotal;
		sumObj.subtotal += subtotal;
		sumObj.discount += discount;
		sumObj.VAT += VAT;
		sumObj.total += Math.max(subtotal - discount + VAT, 0);
		return sumObj;
	}, {
		subtotal: 0,
		discount: 0,
		VAT: 0,
		total: 0,
	});
}
