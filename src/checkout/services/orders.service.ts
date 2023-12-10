import { CreationAttributes, Transaction } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { IOrder } from '../models/orders.model';
import { Order, OrderItem, User, Cart, Transaction as tx } from '../models';
import { OrderStatus } from '../models/orders.model';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

export type ModelServiceOptions = { transaction?: Transaction };

async function createOrder(
	dto: Omit<CreationAttributes<IOrder>, 'id'>,
	options?: ModelServiceOptions
) {
	const newOrder = await Order.create({ ...dto, id: uuid() }, options);
	return newOrder;
}

async function getUserOrders(customer_id: string) {
	const orders = await OrderItem.findAll({
		where: { customer_id: customer_id }, include: [{
			model: User,
			as: 'customer',
			required: true,
			attributes: ['id', 'first_name', 'last_name'],
		}]
	})
	return orders
}

async function getOrderById(orderId: string) {
	const order = await Order.findByPk(orderId);
	return order;
}

async function getOrderItemByMerchantId(merchantId: string) {
	const { count, rows } = await OrderItem.findAndCountAll({ where: { merchant_id: merchantId } });
	const sales = rows.reduce((sales, orderItem) => {
		sales += Number(orderItem.order_price) - Number(orderItem.order_discount) + Number(orderItem.order_VAT)
		return sales;
	}, 0)
	return { count, sales };
}

async function confirmOrder(tx_ref: string, userId?: string) {
	const requiredTransaction = await tx.findOne({ where: { in_app_ref: tx_ref } });
	if (!requiredTransaction) throw new ApiError(httpStatus.NOT_FOUND, "Transaction not found");

	const orderToBeConfirmed = await Order.findOne({ where: { id: requiredTransaction.order_id } });
	if (!orderToBeConfirmed) throw new ApiError(httpStatus.NOT_FOUND, "Order not found")

	orderToBeConfirmed.status = OrderStatus.completed
	await orderToBeConfirmed.save();
	await Cart.destroy({ where: { user_id: userId || orderToBeConfirmed.customer_id } });

	return orderToBeConfirmed;
}

async function orderFailed(tx_ref: string) {
	const requiredTransaction = await tx.findOne({ where: { in_app_ref: tx_ref } });
	if (!requiredTransaction) throw new ApiError(httpStatus.NOT_FOUND, "Transaction not found");

	const orderToBeFailed = await Order.findOne({ where: { id: requiredTransaction.order_id } });
	if (!orderToBeFailed) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");

	orderToBeFailed.status = OrderStatus.cancelled;
	await orderToBeFailed.save();
}

export const ordersService = {
	createOrder,
	getUserOrders,
	getOrderById,
	confirmOrder,
	orderFailed,
	getOrderItemByMerchantId
};
