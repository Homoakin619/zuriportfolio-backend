import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { cartsController } from '../controllers';
import { jwtAuth } from '../middlewares/verify';
import { cartValidation } from '../validation';
import validate from '../middlewares/validate';

export const cartRouter = Router();

// TODO: add middleware
cartRouter.get(
	'/cart-summary',
	jwtAuth.verifyToken,
	auth(),
	cartsController.calculateCartSummary,
);

cartRouter.get('/count', jwtAuth.verifyToken, auth(), cartsController.cartCount);
cartRouter.get('/', jwtAuth.verifyToken, auth(), cartsController.getUserCart);
cartRouter.post('/',  validate(cartValidation.guestCartSummary), jwtAuth.verifyToken, auth(),cartsController.addToCart);
cartRouter.delete(
	'/items/:itemId',
	jwtAuth.verifyToken,
	cartsController.removeFromCart,
);
cartRouter.post(
	'/guest-cart-summary',
	validate(cartValidation.guestCartSummary),
	cartsController.getGuestCartSummary,
);
cartRouter.delete(
	'/clear-cart',
	jwtAuth.verifyToken,
	cartsController.removeAllItemsFromCart,
);

/** SWAGGER DOCS */

/**
 * @swagger
 * /api/checkout/api/carts/cart-summary:
 *   get:
 *     summary: Get Cart Summary
 *     description: Calculate the cart's summary, including the total amount to pay.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart summary retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation.
 *                 data:
 *                   type: object
 *                   properties:
 *                     subtotal:
 *                       type: number
 *                       description: Subtotal of items in the cart.
 *                     discount:
 *                       type: number
 *                       description: Total discount applied.
 *                     VAT:
 *                       type: number
 *                       description: Total VAT (Value Added Tax) applied.
 *                     total:
 *                       type: number
 *                       description: Total amount to be paid.
 *       404:
 *         description: Cart is empty.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation.
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the cart is empty.
 *     requestBody:
 *       required: false
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication.
 *         schema:
 *           type: string
 */

/**
 * @swagger
 * /api/checkout/api/carts/{itemId}:
 *   delete:
 *     summary: Remove Item from Cart
 *     description: Remove a product from the user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: ID of the product to be removed from the cart.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from the cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the product was removed from the cart.
 *       404:
 *         description: Product not found in the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the operation.
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the product was not found in the cart.
 *     requestBody:
 *       required: false
 */

/**
 * @swagger
 * /api/checkout/api/carts:
 *   post:
 *     summary: Add products to cart
 *     tags: [Cart]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_ids:
 *                 type: array
 *                 required: true
 *                 example: ["f7c1a7f3-6a53-4c0c-8959-ecdd87fbf3e9"]
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 product_id:
 *                   type: string
 *                 user_id:
 *                   type: string
 *       500:
 *         description: Internal Error
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/checkout/api/carts/:
 *   get:
 *     summary: Retrieve User Cart
 *     description: Retrieve the user's cart information.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User cart retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                     description: ID of the product.
 *                   productName:
 *                     type: string
 *                     description: Name of the product.
 *                   productPrice:
 *                     type: number
 *                     description: price of the product in the cart.
 *                   productDescription:
 *                    type: string
 *                   description: Description of the product.
 *                  productSeller:
 *                   type: string
 *                  description: Seller of the product.
 *                 productImage:
 *                  type: string
 *                 description: link to location of product image.
 *       '404':
 *         description: Empty Cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the cart is empty.
 *       '400':
 *         description: Unauthorized User
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the user is not authorized.
 *     requestBody:
 *       required: false
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: false
 *         description: Bearer token for authentication.
 *         schema:
 *           type: string
 */
