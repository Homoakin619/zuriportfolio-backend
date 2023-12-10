import {
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import { Role, sequelizeInstance } from '.';

export interface IUser
	extends Model<InferAttributes<IUser>, InferCreationAttributes<IUser>> {
	id: string;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	// token: string;
	role_id: number;
	section_order: string;
	password: string;
	provider: string;
	profile_pic: string;
	refresh_token: string;
	phone_number: string;
	is_verified: boolean;
	two_factor_auth: boolean;
	location: string;
	country: string;
}

export const User = sequelizeInstance.define<IUser>(
	'user',
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
		},
		username: DataTypes.STRING,
		first_name: DataTypes.STRING,
		last_name: DataTypes.STRING,
		email: DataTypes.STRING,
		section_order: DataTypes.TEXT,
		password: DataTypes.STRING,
		provider: DataTypes.STRING,
		profile_pic: DataTypes.TEXT,
		refresh_token: DataTypes.STRING,
		// token: DataTypes.STRING,
		role_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Role,
				key: 'id',
			},
		},
		phone_number: DataTypes.STRING,
		is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
		two_factor_auth: { type: DataTypes.BOOLEAN, defaultValue: false },
		location: DataTypes.STRING,
		country: DataTypes.STRING,
	},
	{ tableName: 'user', timestamps: false },
);
