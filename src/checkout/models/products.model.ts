import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import { ProductDigitalAsset, ProductImage, PromoProduct, Promotion, Shop, User, sequelizeInstance } from '.';
import { IPromotion } from './promotions.model';
import { IUser } from './user.model';
import { IShop } from './shop.model';
import { IProductImage } from './product_image.model';
import { IProductDigitalAsset } from './product_digital_asset.model';

export enum ADMIN_STATUS {
	PENDING = 'pending',
	REVIEW = 'review',
	APPROVED = 'approved',
	SUSPENDED = 'suspended',
	BLACKLIST = 'blacklist',
}

export enum PRODUCT_STATUS {
	TEMPORARY = 'temporary',
	ACTIVE = 'active',
}

export interface IProduct
	extends Model<InferAttributes<IProduct>, InferCreationAttributes<IProduct>> {
	id: string;
	user_id: string;
	shop_id: string;
	name: string;
	description: string;
	quantity: number;
	// category: number;
	price: number;
	discount_price: number;
	tax: number;
	admin_status: CreationOptional<ADMIN_STATUS>;
	// image_id: number;
	is_deleted: PRODUCT_STATUS;
	is_published: boolean;
	currency: string;
	average_rating?: number;
	promotions?: Partial<IPromotion>[];
	user?: Partial<IUser>;
	shop?: Partial<IShop>;
	productImage?: Partial<IProductImage>;
	assets?: Partial<IProductDigitalAsset>;
}

export const Product = sequelizeInstance.define<IProduct>(
	'product',
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.UUID,
			references: {
				model: User,
				key: 'id',
			},
		},
		shop_id: {
			type: DataTypes.UUID,
			references: {
				model: Shop,
				key: 'id',
			},
		},
		// image_id: {
		// 	type: DataTypes.INTEGER,
		// 	references: {
		// 		model: ProductImage,
		// 		key: 'id',
		// 	},
		// },
		name: DataTypes.STRING,
		description: DataTypes.STRING,
		quantity: DataTypes.INTEGER,
		// category: DataTypes.INTEGER,
		price: DataTypes.DECIMAL(10, 2),
		discount_price: DataTypes.DECIMAL(10, 2),
		tax: DataTypes.DECIMAL(10, 2),
		admin_status: {
			type: DataTypes.ENUM(
				ADMIN_STATUS.PENDING,
				ADMIN_STATUS.REVIEW,
				ADMIN_STATUS.APPROVED,
				ADMIN_STATUS.BLACKLIST,
			),
			defaultValue: ADMIN_STATUS.PENDING,
		},
		is_deleted: {
			type: DataTypes.ENUM(PRODUCT_STATUS.ACTIVE, PRODUCT_STATUS.TEMPORARY),
			defaultValue: PRODUCT_STATUS.ACTIVE,
		},
		is_published: DataTypes.BOOLEAN,
		currency: DataTypes.STRING,
	},
	{ tableName: 'product' },
);

Product.belongsTo(User, { foreignKey: 'user_id' });
Product.belongsTo(Shop, { foreignKey: 'shop_id' });
Product.hasOne(ProductImage, { foreignKey: 'product_id' });
Product.belongsToMany(Promotion, { as: 'promotions', through: 'promo_product', foreignKey: 'product_id', otherKey: 'promo_id' });
Product.hasOne(ProductDigitalAsset, { as: 'assets', foreignKey: 'product_id' });