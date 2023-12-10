import httpStatus from 'http-status';
import Asyncly from '../utils/Asyncly';
import { cartsService, } from '../services';
import ApiError from '../utils/ApiError';
import { ProductImage } from '../models/product_image.model';
import { createResponseBody } from '../utils/helper';

function isValidUUID(uuid: string) {
	const uuidPattern =
		/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
	return uuidPattern.test(uuid);
}

const getUserCart = Asyncly(async (req, res) => {
	const id = req.user?.id as string;
	const userCarts = await cartsService.getUserCart(id);

	const response = userCarts.map((cart) => {
		return {
			id: cart.id,
			productId: cart.product_id,
			productTitle: cart.product?.name,
			productPrice: cart.product?.price,
			productDiscount: cart.product?.discount_price,
			productDescription: cart.product?.description,
			productSeller: cart.product?.shop?.name,
			productImage: cart.product?.productImage?.url,
		};
	});

	return res
			.status(httpStatus.OK)
			.json(createResponseBody({data: response,message: "Cart Fetched"}))
});

const addToCart = Asyncly(async (req, res) => {
	const { product_ids } = req.body;
	const user_id = req.user?.id;
	if (!product_ids || !user_id) {
		res
			.status(httpStatus.BAD_REQUEST)
			.json(createResponseBody(
				{status: 400, success: false, 
					message: 'Something is wrong, check your input' }));
		return;
	}
	const product = await cartsService.addToCart({ product_ids, user_id });
	if (!product) {
		return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.json(createResponseBody(
				{status: 500,success: false, 
					message: 'Product not added' }))
		
	}

	res.status(httpStatus.CREATED).json({
			success: true,
			status: httpStatus.CREATED,
			message: 'Successfully added to cart'
		})
	})

const removeFromCart = Asyncly(async (req, res) => {
	const itemId = req.params.itemId;
	if (!isValidUUID(itemId)) {
		return res.status(httpStatus.BAD_REQUEST).json({
			status: httpStatus.BAD_GATEWAY,
			success: false,
			message: 'Invalid ID',
		});
	}
	const response = await cartsService.removeFromCart(itemId);
	res.json(
		createResponseBody({data: response,message: 'Item removed from cart', status: 200 }))
		
	});

const calculateCartSummary = Asyncly(async (req, res) => {
	const userId = req.user?.id as string;
	if (!userId || userId === '') throw new ApiError(httpStatus.NOT_FOUND, 'UserId not found');
	const cartSummary = await cartsService.getCartSummary(userId);
	res.status(200).json(
		createResponseBody({data: cartSummary,message: 'CartSummary Fetched'}));
	})

const getGuestCartSummary = Asyncly(async (req, res) => {
	const { product_ids } = req.body;
	const cartSummary = await cartsService.getCartSummaryByProductIds(product_ids);
	res.status(200).json(createResponseBody({data: cartSummary,message: 'CartSummary Fetched'}));
});

const cartCount = Asyncly(async (req, res) => {
	const id = req.user?.id as string;
	const userCarts = await cartsService.getUserCart(id);
	const cartItemCount = userCarts.length;
	res.status(200).json(createResponseBody({data: cartItemCount,message: 'Cart Count Fetched'}));
});

const removeAllItemsFromCart = Asyncly (async (req, res) => {
    const user_id = req.user?.id; 
	if ( !user_id) {
		res
			.status(httpStatus.BAD_REQUEST)
			.json(createResponseBody(
				{status: 400, success: false, 
					message: 'Something is wrong, check your input' }));
		return;
	}
	const result = await cartsService.removeAllItemsFromCart(user_id);
	res.status(httpStatus.OK).json({
		success: true,
		status: httpStatus.OK,
		message: result
	})
});


export const cartsController = {
	getUserCart,
	addToCart,
	removeFromCart,
	calculateCartSummary,
	getGuestCartSummary,
	cartCount,
	removeAllItemsFromCart,
};
