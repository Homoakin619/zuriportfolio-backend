import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import { User, sequelizeInstance } from '.';

export enum OrderStatus {
	'pending' = 'pending',
	'cancelled' = 'cancelled',
	'completed' = 'completed',
}

export interface IOrder
	extends Model<InferAttributes<IOrder>, InferCreationAttributes<IOrder>> {
	id: string;
	customer_id: string;
	subtotal: number;
	VAT: number;
	discount: number;
	status: CreationOptional<OrderStatus>;
	createdAt?: string;
	updatedAt?: string;
}

export const Order = sequelizeInstance.define<IOrder>(
	'order',
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
		},
		subtotal: DataTypes.DECIMAL,
		VAT: DataTypes.DECIMAL,
		discount: DataTypes.DECIMAL,
		customer_id: {
			type: DataTypes.UUID,
			references: { model: User, key: 'id' },
		},
		status: {
			type: DataTypes.ENUM(
				OrderStatus.pending,
				OrderStatus.cancelled,
				OrderStatus.completed,
			),
			defaultValue: OrderStatus.pending,
		},
	},
	{ tableName: 'order' },
);
