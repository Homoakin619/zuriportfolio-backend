import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import { Product, PromoProduct, User, sequelizeInstance } from '.';

export enum DiscountType {
	Percentage = 'Percentage',
	Fixed = 'Fixed',
}

export interface IPromotion
	extends Model<
		InferAttributes<IPromotion>,
		InferCreationAttributes<IPromotion>
	> {
	id: CreationOptional<number>;
	user_id: string;
	code: string;
	promotion_type: string;
	discount_type: DiscountType;
	quantity: number;
	amount: number;
	// product_id: string;
	valid_from: string;
	valid_to: string;
	maximum_discount_price: number;
}

export const Promotion = sequelizeInstance.define<IPromotion>(
	'promotion',
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		user_id: {
			type: DataTypes.UUID,
			references: {
				model: User,
				key: 'id',
			},
		},
		code: DataTypes.STRING,
		promotion_type: DataTypes.STRING,
		discount_type: DataTypes.ENUM(DiscountType.Fixed, DiscountType.Percentage),
		quantity: DataTypes.INTEGER,
		amount: DataTypes.DECIMAL,
		valid_from: DataTypes.DATE,
		valid_to: DataTypes.DATE,
		maximum_discount_price: DataTypes.DECIMAL,
	},
	{ tableName: 'promotion' },
);

Promotion.belongsTo(User, { foreignKey: 'user_id' });
// Promotion.belongsToMany(Product, { through: PromoProduct });
