import { CreationAttributes, Op } from 'sequelize';
import { IOrderItem } from '../models/order_items.model';
import { OrderItem, Product, ProductDigitalAsset, ProductImage, User } from '../models';
import { DiscountType } from '../models/promotions.model';
import { IProduct } from '../models/products.model';
import { ModelServiceOptions } from './orders.service';

async function createOrderItems(
	dto: Pick<IOrderItem, 'customer_id' | 'product_id' | 'order_id'>[],
	options?: ModelServiceOptions
) {
	const currentDate = new Date();
	const products = await Product.findAll({
		where: {
			id: dto.map((item) => item.product_id),
		},
		// include: [
		// 	{
		// 		model: Promotion,
		// 		attributes: ['amount', 'discount_type', 'maximum_discount_price', 'valid_from', 'valid_to'],
		// 		as: 'promotions',
		// 	},
		// ],
	});
	const payload: CreationAttributes<IOrderItem>[] = dto.map((item) => {
		const product = products.find(
			(product) => product.id === item.product_id,
		) as IProduct;
		const productPrice = Number(product.discount_price) || Number(product.price) || 0;
		const promotion = product?.promotions?.[0];
		const discount = promotion
			? promotion.discount_type == DiscountType.Fixed
				? Number(promotion.amount)
				: (Number(promotion.amount) / 100) * productPrice
			: 0;
		return {
			customer_id: item.customer_id,
			order_id: item.order_id,
			product_id: item.product_id,
			merchant_id: product.user_id,
			order_price: productPrice,
			order_VAT: product.tax ?? 0,
			order_discount: discount,
			promo_id: promotion?.id,
		};
	});
	const newOrderItems = await OrderItem.bulkCreate(payload, options);
	return newOrderItems;
}

const getOrderItems = async (orderId: string) => {
	const orderItems = await OrderItem.findAll({
		where: {
			order_id: orderId
		},
		include: [
			{
				model: Product,
				attributes: ['id', 'name', 'user_id', 'price', 'discount_price', 'description',],
				include: [
					{
						model: ProductImage,
						attributes: ['url'],
					},
					{
						model: ProductDigitalAsset,
						as: 'assets',
						required: false
					},
				]
			}, {
				model: User,
				as: 'merchant',
				attributes: ['first_name', 'last_name', 'email']
			}, {
				model: User,
				as: 'customer',
				attributes: ['first_name', 'last_name', 'email']
			}
		],
	})
	return orderItems
}

const getOrderItemsWithPromo = async (orderId: string) => {
	const orderItems = await OrderItem.findAll({
		where: {
			order_id: orderId,
			promo_id: {
				[Op.not]: null
			}
		},
		include: [
			{
				model: Product,
				attributes: ['id', 'name', 'user_id', 'price', 'discount_price', 'description',],
				include: [
					{
						model: ProductImage,
						attributes: ['url'],
					},
					{
						model: ProductDigitalAsset,
						as: 'assets',
						required: false
					},
				]
			}, {
				model: User,
				as: 'merchant',
				attributes: ['first_name', 'last_name', 'email']
			}, {
				model: User,
				as: 'customer',
				attributes: ['first_name', 'last_name', 'email']
			}
		],
	})
	return orderItems
}

export const orderItemsService = {
	createOrderItems,
	getOrderItems,
	getOrderItemsWithPromo
};
