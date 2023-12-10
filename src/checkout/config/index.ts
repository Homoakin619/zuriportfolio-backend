require('dotenv').config();
import validateEnv from '../utils/validateEnv.util';

validateEnv();

const config = {
	env: process.env.NODE_ENV as string,
	port: process.env.PORT as string,
	baseUrl: process.env.BASE_URL as string,
	messaging_url: process.env.MESSAGING_URL as string,
	shop_internal_url: process.env.SHOP_INTERNAL_URL as string,
	customerSupport: process.env.CUSTOMER_SUPPORT_MAIL as string,
	sequelize: {
		url: process.env.DB_URL as string,
		host: process.env.DB_HOST as string,
		database: process.env.DB_NAME as string,
		user: process.env.DB_USER as string,
		port: +process.env.DB_PORT!,
		password: process.env.DB_PASSWORD as string,
		dialect: process.env.DIALECT as string,
	},
	flw: {
		secretKey: process.env.FLW_SECRET_KEY as string,
		secretHash: process.env.FLW_SECRET_HASH as string,
	},
	paystack: {
		secretKey: process.env.PAYSTACK_SECRET_KEY as string,
	},
	amqp: {
		url: process.env.AMQP_SERVER_URL as string,
	},
};
export default config;
