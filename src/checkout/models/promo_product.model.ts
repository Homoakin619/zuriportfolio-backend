import {
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import { Product, Promotion, User, sequelizeInstance } from '.';

export interface IPromoProduct
	extends Model<
		InferAttributes<IPromoProduct>,
		InferCreationAttributes<IPromoProduct>
	> {
	id: number;
	product_id: string;
	promo_id: number;
	user_id: string;
}

export const PromoProduct = sequelizeInstance.define<IPromoProduct>(
	'promoProduct',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		product_id: {
			type: DataTypes.UUID,
			references: {
				model: Product,
				key: 'id',
			},
		},
		promo_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Promotion,
				key: 'id',
			},
		},
		user_id: {
			type: DataTypes.UUID,
			references: {
				model: User,
				key: 'id',
			},
		},
	},
	{ tableName: 'promo_product', timestamps: false },
);
