import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Zuri Cart Checkout API',
			version: '1.0.0',
			description: 'A simple Express Library API for Zuri Cart Checkout',
		},
		servers: [
			// {
			// 	url: 'https://zuri-cart-checkout.onrender.com',
			// },
			{
				url: 'http://localhost:8080',
			},
		],
	},
	apis: ['./src/checkout/routes/*'],
};

export const swaggerSpec = swaggerJsdoc(options);
