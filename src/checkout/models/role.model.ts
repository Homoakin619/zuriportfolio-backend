import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import { sequelizeInstance } from '.';

export interface IRole
	extends Model<InferAttributes<IRole>, InferCreationAttributes<IRole>> {
	id: CreationOptional<number>;
	name: string;
}

export const Role = sequelizeInstance.define<IRole>(
	'role',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: DataTypes.STRING,
	},
	{ tableName: 'role' },
);
