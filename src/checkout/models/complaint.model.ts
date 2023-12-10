import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import { Product, User, sequelizeInstance } from '.';
import { IProduct } from './products.model';

export interface IComplaint
	extends Model<InferAttributes<IComplaint>, InferCreationAttributes<IComplaint>> {
	id: CreationOptional<number>;
	user_id: string;
	product_id: string;
	complaint_text: string;
	status: CreationOptional<string>;
	createAt?: string;
	updateAt?: string;

}

export const Complaint = sequelizeInstance.define<IComplaint>(
	'complaint',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
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
		complaint_text: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ tableName: 'complaint' },
);

Complaint.belongsTo(User, { foreignKey: 'user_id' });
Complaint.belongsTo(Product, { foreignKey: 'product_id' });
