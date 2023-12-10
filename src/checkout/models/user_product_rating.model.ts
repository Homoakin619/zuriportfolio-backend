import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import { Product, User, sequelizeInstance } from '.';

export interface IUserProductRating
	extends Model<
		InferAttributes<IUserProductRating>,
		InferCreationAttributes<IUserProductRating>
	> {
	id: CreationOptional<number>;
	user_id: string;
	product_id: string;
	rating: number;
}

export const UserProductRating = sequelizeInstance.define<IUserProductRating>(
	'userProductRating',
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
		rating: DataTypes.INTEGER,
	},
	{ tableName: 'user_product_rating' },
);

UserProductRating.belongsTo(User, { foreignKey: 'user_id' });
UserProductRating.belongsTo(Product, { foreignKey: 'product_id' });
