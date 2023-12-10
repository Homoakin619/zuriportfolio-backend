import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';
import { Product, sequelizeInstance } from '.';

export interface IProductImage
	extends Model<
		InferAttributes<IProductImage>,
		InferCreationAttributes<IProductImage>
	> {
	id: CreationOptional<number>;
	product_id: string;
	url: string;
}

export const ProductImage = sequelizeInstance.define<IProductImage>(
	'productImage',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		product_id: {
			type: DataTypes.UUID,
			references: {
				model: Product,
				key: 'id',
			},
		},
		url: DataTypes.STRING,
	},
	{ tableName: 'product_image' },
);

// ProductImage.belongsTo(Product, { foreignKey: 'product_id' });
