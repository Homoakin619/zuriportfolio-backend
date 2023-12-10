import { Sequelize } from 'sequelize';
import config from '../config';
import { logger } from '../config/logger';

const { sequelize } = config;
const password = encodeURIComponent("hngx#dev")

// export const sequelizeInstance = new Sequelize(sequelize.url;
export const sequelizeInstance = new Sequelize(
	sequelize.database,
	sequelize.user,
	sequelize.password,
	{
		host: sequelize.host,
		dialect: 'postgres',
		port: sequelize.port
	},
);

sequelizeInstance.sync({ force: false })
  .then(() => {
    logger.info('Database synchronization complete');
    return sequelizeInstance.authenticate();
  })
  .then(() => {
    logger.info('Database is good');
  })
  .catch(err => {
    logger.error('Error synchronizing the database or authenticating:', err);
  });


// sequelizeInstance
// 	.authenticate()
// 	.then(() => {
// 		logger.info('Database is good');
// 	})
// 	.catch((err: unknown) => {
// 		logger.error('Database no dey work', err);
// 	});

export { Role } from './role.model';
export { User } from './user.model';
export { Activity } from './activity.model';
export { Shop } from './shop.model';
export { Promotion } from './promotions.model';
export { ProductImage } from './product_image.model';
export { ProductDigitalAsset } from './product_digital_asset.model';
export { Product } from './products.model';
export { PromoProduct } from './promo_product.model';
export { UserProductRating } from './user_product_rating.model';
export { Cart } from './carts.model';
export { Order } from './orders.model';
export { OrderItem } from './order_items.model';
export { Transaction } from './transactions.model';
