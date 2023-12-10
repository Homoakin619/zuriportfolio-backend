import { Cart, Product, ProductImage, Promotion, Shop, sequelizeInstance } from '../models';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { v4 as uuid } from 'uuid';
import { DiscountType } from '../models/promotions.model';
import {Op} from "sequelize";


async function getUserCart(id: string | number) {
	const userCarts = await Cart.findAll({
		where: { user_id: id },
		include: [
			{
				model: Product,
				attributes: ['id', 'name', 'price', 'discount_price', 'description',],
				include: [
					{
						model: Shop,
						attributes: ['id', 'name'],
					},
					{
						model: ProductImage,
						attributes: ['url'],
					}
				]
			},
		],
	});
	return userCarts;
}

async function addToCart({ user_id, product_ids }: { user_id: string, product_ids: string[] }) {
	const existingCartEntries = await Cart.findAll({
		where: {
			user_id,
			product_id: {
				[Op.in]: product_ids
			}
		}
	});
	const productsToAdd = product_ids.filter(productId => {
		// Check if the product is not already in the cart
		return !existingCartEntries.some(entry => entry.product_id === productId);
	});

	if (productsToAdd.length === 0) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			'The specified product(s) is already in the cart.'
		);
	}

	const newCartEntries = productsToAdd.map(id => ({
		id: uuid(),
		user_id,
		product_id: id,
	}));

	const addedProducts = await Cart.bulkCreate(newCartEntries);

	return [...existingCartEntries, ...addedProducts];

}
async function removeFromCart(itemId: string) {
	return await Cart.destroy({ where: { id: itemId, } });

}

async function getCartSummary(userId: string) {
	const cartItems = await Cart.findAll({
		where: { user_id: userId },
		include: [
			{
				model: Product,
				attributes: ['price', 'discount_price', 'tax'],
				// include: [
				// 	{
				// 		model: Promotion,
				// 		attributes: ['amount', 'discount_type', 'maximum_discount_price', 'valid_from', 'valid_to'],
				// 		as: 'promotions',
				// 	},
				// ],
			},

		],
	});
	const summary = cartItems.reduce(
		(sumObj, item) => {
			const product = item.product;
			if (typeof product !== 'object')
				throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

			const subtotal = Number(product.discount_price) || Number(product.price) || 0;

			const discount =
				product.promotions && product.promotions.length > 0
					? product.promotions[0].discount_type === DiscountType.Fixed
						? Number(product.promotions[0].amount)
						: (Number(product.promotions[0].amount) / 100) * subtotal
					: 0;
			const VAT = product.tax ? (Number(product.tax) / 100) * subtotal : 0;
			sumObj.subtotal += subtotal;
			sumObj.discount += discount;
			sumObj.VAT += VAT;
			sumObj.total += Number(Math.max(subtotal - discount + VAT, 0).toFixed(2));
			return sumObj;
		},
		{
			subtotal: 0,
			discount: 0,
			VAT: 0,
			total: 0,
		},
	);
	return summary;
}

async function getCartSummaryByProductIds(productIds: string[]) {
	const products = await Product.findAll({
		where: { id: productIds },
		attributes: ['price', 'discount_price', 'tax'],
		// include: [
		// 	{
		// 		model: Promotion,
		// 		attributes: ['amount', 'discount_type', 'maximum_discount_price', 'valid_from', 'valid_to'],
		// 		as: 'promotions',
		// 	},
		// ],
	});
	const summary = products.reduce(
		(sumObj, product) => {
			const subtotal = Number(product.discount_price) || Number(product.price) || 0;
			const discount =
				product.promotions && product.promotions.length > 0
					? product.promotions[0].discount_type === DiscountType.Fixed
						? Number(product.promotions[0].amount)
						: (Number(product.promotions[0].amount) / 100) * subtotal
					: 0;
			const VAT = product.tax ? (Number(product.tax) / 100) * subtotal : 0;
			sumObj.subtotal += subtotal;
			sumObj.discount += discount;
			sumObj.VAT += VAT;
			sumObj.total += Number(Math.max(subtotal - discount + VAT, 0).toFixed(2));
			return sumObj;
		},
		{
			subtotal: 0,
			discount: 0,
			VAT: 0,
			total: 0,
		},
	);
	return summary;
}

async function removeAllItemsFromCart(user_id: string) {
        const deletedRows = await Cart.destroy({
            where: { user_id: user_id },
		});

        if (deletedRows > 0) {
            return { message: `All items removed from the cart for user with ID ${user_id}` };
        } else {
            return { message: `No items found in the cart for user with ID ${user_id}` };
        }
}

export const cartsService = {
	getUserCart,
	addToCart,
	removeFromCart,
	getCartSummary,
	getCartSummaryByProductIds,
	removeAllItemsFromCart,
};
