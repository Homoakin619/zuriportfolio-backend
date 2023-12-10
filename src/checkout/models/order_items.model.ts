import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import { Order, Product, Promotion, User, sequelizeInstance } from '.';
import { IUser } from './user.model';
import { IProduct } from './products.model';

export interface IOrderItem
	extends Model<
		InferAttributes<IOrderItem>,
		InferCreationAttributes<IOrderItem>
	> {
	id: CreationOptional<number>;
	order_id: string;
	product_id: string;
	customer_id: string;
	merchant_id: string;
	order_price: number;
	order_VAT: number;
	order_discount: number;
	promo_id: CreationOptional<number | null>;
	customer?: Partial<IUser>;
	merchant?: Partial<IUser>;
	product?: Partial<IProduct>;
	createdAt?: string;
	updatedAt?: string;
}

export const OrderItem = sequelizeInstance.define<IOrderItem>(
	'orderItem',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		order_id: {
			type: DataTypes.UUID,
			references: {
				model: Order,
				key: 'id',
			},
		},
		product_id: {
			type: DataTypes.UUID,
			references: {
				model: Product,
				key: 'id',
			},
		},
		customer_id: {
			type: DataTypes.UUID,
			references: {
				model: User,
				key: 'id',
			},
		},
		merchant_id: {
			type: DataTypes.UUID,
			references: {
				model: User,
				key: 'id',
			},
		},
		order_price: {
			type: DataTypes.DECIMAL,
		},
		order_VAT: {
			type: DataTypes.DECIMAL,
		},
		order_discount: {
			type: DataTypes.DECIMAL,
		},
		promo_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Promotion,
				key: 'id',
			},
			allowNull: true,
		},
	},
	{ tableName: 'order_item' },
);

OrderItem.belongsTo(User, { foreignKey: 'merchant_id', as: 'merchant' });
OrderItem.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
