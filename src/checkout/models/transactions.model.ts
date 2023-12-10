import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import { Order, sequelizeInstance } from '.';

export enum TransactionStatus {
	'pending' = 'pending',
	'failed' = 'failed',
	'success' = 'success',
}

export interface ITransaction
	extends Model<
		InferAttributes<ITransaction>,
		InferCreationAttributes<ITransaction>
	> {
	id: CreationOptional<number>;
	amount: number;
	status: CreationOptional<TransactionStatus>;
	order_id: string;
	promo?: string;
	currency: string;
	provider_ref: string;
	in_app_ref: string;
	provider: string;
}

export const Transaction = sequelizeInstance.define<ITransaction>(
	'transaction',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		amount: DataTypes.DECIMAL,
		status: {
			type: DataTypes.ENUM(
				TransactionStatus.failed,
				TransactionStatus.pending,
				TransactionStatus.success,
			),
			defaultValue: TransactionStatus.pending,
		},
		order_id: {
			type: DataTypes.UUID,
			references: {
				model: Order,
				key: 'id',
			},
		},
		currency: DataTypes.STRING,
		provider_ref: DataTypes.STRING,
		in_app_ref: DataTypes.STRING,
		provider: DataTypes.STRING,
	},
	{ tableName: 'transaction' },
);

Transaction.belongsTo(Order, { foreignKey: 'order_id' });
