import { cleanEnv, str } from 'envalid';

function validateEnv() {
	cleanEnv(process.env, {
		NODE_ENV: str(),
		PORT: str(),
		BASE_URL: str(),
		DB_URL: str(),
		DB_NAME: str(),
		DB_HOST: str(),
		DB_USER: str(),
		DB_PASSWORD: str(),
		DB_PORT: str(),
		DB_DIALECT: str(),
		FLW_SECRET_KEY: str(),
		FLW_SECRET_HASH: str(),
		PAYSTACK_SECRET_KEY: str(),
		AMQP_SERVER_URL: str(),
		CUSTOMER_SUPPORT_MAIL: str(),
		MESSAGING_URL: str(),
		SHOP_INTERNAL_URL: str(),
	});
}

export default validateEnv;
