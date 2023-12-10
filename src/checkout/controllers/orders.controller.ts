import httpStatus from 'http-status';
import {
	cartsService,
	ordersService,
	transactionsService,
	userService,
} from '../services';
import { orderItemsService } from '../services/order_items.service';
import Asyncly from '../utils/Asyncly';
import ApiError from '../utils/ApiError';
import { sequelizeInstance } from '../models';
import { logger } from '../config/logger';

const createOrder = Asyncly(async (req, res) => {
	const userId = req.user?.id as string;
	const { redirect_url, payment_method } = req.body;

	const user = await userService.findUserById(userId);
	if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	const cart = await cartsService.getUserCart(userId);
	if (!cart.length)
		return res.status(httpStatus.NOT_FOUND).json({ message: 'Empty cart' });

	const tx_ref = `Zuri-tx-${Date.now()}`;
	const cartSummary = await cartsService.getCartSummary(userId);

	const createOrderTransaction = await sequelizeInstance.transaction();
	const order = await ordersService.createOrder({
		discount: cartSummary.discount,
		VAT: cartSummary.VAT,
		subtotal: cartSummary.subtotal,
		customer_id: userId,
	});

	const oItemPayload = cart.map((cartItem) => ({
		order_id: order.id,
		product_id: cartItem.product_id,
		customer_id: userId,
	}));
	const orderItems = await orderItemsService.createOrderItems(oItemPayload, { transaction: createOrderTransaction });
	if (!orderItems || !orderItems.length) {
		createOrderTransaction.rollback();
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			'Error processsing order items',
		);
	}

	const tx_response = await transactionsService.initiateTransaction(
		{
			amount: cartSummary.total,
			redirect_url: redirect_url,
			currency: 'NGN',
			tx_ref,
			customer: {
				email: user.email,
				name: `${user.first_name} ${user.last_name}`,
			},
		},
		payment_method,
	);
	if (!tx_response) {
		createOrderTransaction.rollback();
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			'Could not initiate the transaction',
		);
	}
	
	const transaction = await transactionsService.createTransaction({
		amount: cartSummary.total,
		currency: 'NGN',
		order_id: order.id,
		provider: payment_method,
		in_app_ref: tx_ref,
		provider_ref: tx_response.provider_ref,
	}, { transaction: createOrderTransaction });
	if (!transaction) {
		createOrderTransaction.rollback();
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			'Failed to process transaction',
		);
	}
	createOrderTransaction.commit();
	res.status(httpStatus.CREATED).json({
		status: httpStatus.CREATED,
		success: true,
		message: 'Transaction initiated successfully',
		data: {
			transaction_url: tx_response.tx_url
		}
	});
});

const getUserOrders = Asyncly(async (req, res) => {
	const userId = req.user?.id as string;
	if (!userId) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	const orders = await ordersService.getUserOrders(userId);
	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'users orders retrieved successfully',
		data:orders
	});
});

const getOrderItemsByOrderId = Asyncly(async (req, res) => {
	const { orderId } = req.params;
	const orders = await orderItemsService.getOrderItems(orderId);
	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'order items retrieved successfully',
		data:orders
	});
});


const getOrderById = Asyncly(async (req, res) => {
	const { orderId } = req.params;
	const singleOrder = await ordersService.getOrderById(orderId);
	if (!singleOrder) {
		res.status(httpStatus.NOT_FOUND).json({ error: 'order not found' });
	}
	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'order retrieved successfully',
		data:singleOrder
	});
});

const confirmOrder = Asyncly(async (req, res) => {
	const userId = req.user?.id as string;
	const { tx_ref, status } = req.body;

	if (!userId) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
	}

	if (!status) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			'transaction status is required',
		);
	}
	if (status === "success" || status === "completed") {
		const user = await userService.findUserById(userId);
		const order = await ordersService.confirmOrder(tx_ref, userId);

		res.status(httpStatus.OK).json({
			status: httpStatus.OK,
			success: true,
			message: 'Order confirmed successfully',
			data: {
				email: user?.email,
				firstName: user?.first_name,
				lastName: user?.last_name,
				orderId: order?.id,
				subtotal: order?.subtotal,
				VAT: order?.VAT,
				discount: order?.discount,
				status: order?.status,
			},
		});
	} else {
		await ordersService.orderFailed(tx_ref)
		res.status(httpStatus.BAD_REQUEST).json({
			status: httpStatus.BAD_REQUEST, 
			success:false, 
			message:"Order failed!"
		})
	}
});

const orderSummaryPerMerchant = Asyncly(async (req, res) => {
	const { merchantId } = req.params;
	const orderSummary = await ordersService.getOrderItemByMerchantId(merchantId);
	if (!orderSummary) {
		return res.status(httpStatus.NOT_FOUND).json({
			status:httpStatus.NOT_FOUND,
			success: false, 
			message: 'Merchant not found',


		});
	}
	res.json({
		status: httpStatus.OK,
		success: true,
		message: 'Merchant order summary retrieved successfully',
		data:orderSummary
	});
});

export const ordersController = {
	createOrder,
	getUserOrders,
	getOrderItemsByOrderId,
	getOrderById,
	confirmOrder,
	orderSummaryPerMerchant
};
