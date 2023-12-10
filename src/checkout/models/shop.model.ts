import {
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import { User, sequelizeInstance } from '.';

export enum ADMIN_STATUS {
	PENDING = 'pending',
	REVIEW = 'review',
	APPROVED = 'approved',
	SUSPENDED = 'suspended',
	BLACKLIST = 'blacklist',
}

export enum RESTRICTED {
	NO = 'no',
	TEMPORARY = 'temporary',
	PERMANENT = 'permanent',
}

export enum SHOP_STATUS {
	TEMPORARY = 'temporary',
	ACTIVE = 'active',
}

export interface IShop
	extends Model<InferAttributes<IShop>, InferCreationAttributes<IShop>> {
	id: string;
	merchant_id: string;
	name: string;
	policy_confirmation: boolean;
	restricted: RESTRICTED;
	admin_status: ADMIN_STATUS;
	is_deleted: SHOP_STATUS;
	reviewed: boolean;
	rating: number;
}

export const Shop = sequelizeInstance.define<IShop>(
	'shop',
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
		},
		merchant_id: {
			type: DataTypes.UUID,
			references: {
				model: User,
				key: 'id',
			},
		},
		name: DataTypes.STRING,
		policy_confirmation: DataTypes.BOOLEAN,
		restricted: {
			type: DataTypes.ENUM(
				RESTRICTED.NO,
				RESTRICTED.PERMANENT,
				RESTRICTED.TEMPORARY,
			),
			defaultValue: RESTRICTED.NO,
		},
		admin_status: {
			type: DataTypes.ENUM(
				ADMIN_STATUS.PENDING,
				ADMIN_STATUS.APPROVED,
				ADMIN_STATUS.BLACKLIST,
				ADMIN_STATUS.REVIEW,
				ADMIN_STATUS.SUSPENDED,
			),
			defaultValue: ADMIN_STATUS.PENDING,
		},
		is_deleted: {
			type: DataTypes.ENUM(SHOP_STATUS.ACTIVE, SHOP_STATUS.TEMPORARY),
			defaultValue: SHOP_STATUS.ACTIVE,
		},
		reviewed: DataTypes.BOOLEAN,
		rating: DataTypes.DECIMAL,
	},
	{ tableName: 'shop' },
);
