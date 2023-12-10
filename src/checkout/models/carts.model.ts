import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import { Product, User, sequelizeInstance } from '.';
import { IProduct } from './products.model';

export interface ICart
	extends Model<InferAttributes<ICart>, InferCreationAttributes<ICart>> {
	id: string;
	user_id: string;
	product_id: string;
	product?: Partial<IProduct>;
}

export const Cart = sequelizeInstance.define<ICart>(
	'cart',
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
		product_id: {
			type: DataTypes.UUID,
			references: {
				model: Product,
				key: 'id',
			},
		},
	},
	{ tableName: 'cart' },
);

Cart.belongsTo(User, { foreignKey: 'user_id' });
Cart.belongsTo(Product, { foreignKey: 'product_id' });
