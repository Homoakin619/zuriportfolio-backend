import express from 'express';
import { cartRouter } from './carts.route';
import { orderRouter } from './orders.route';
import { transactionRouter } from './transactions.route';
import { webhookRouter } from './webhooks.route';
import { complaintRouter } from './complaints.route';

const router = express.Router();

const defaultRoutes: {
	path: string;
	route: any;
}[] = [
	{
		path: '/carts',
		route: cartRouter,
	},
	{
		path: '/orders',
		route: orderRouter,
	},
	{
		path: '/transactions',
		route: transactionRouter,
	},
	{
		path: '/webhooks',
		route: webhookRouter,
	},
	{
		path: '/complaints',
		route: complaintRouter,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
