import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from 'sequelize';
import { Product, sequelizeInstance } from '.';

enum ProductDigitalAssetType {
    EXTERNAL = 'external',
    INTERNAL = 'internal'
}

export interface IProductDigitalAsset
    extends Model<
        InferAttributes<IProductDigitalAsset>,
        InferCreationAttributes<IProductDigitalAsset>
    > {
    id: CreationOptional<string>;
    product_id: string;
    name: string;
    notes: string;
    link: string;
    type: ProductDigitalAssetType;
}

export const ProductDigitalAsset = sequelizeInstance.define<IProductDigitalAsset>(
    'productDigitalAsset',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        product_id: {
            type: DataTypes.UUID,
            references: {
                model: Product,
                key: 'id',
            },
        },
        name: DataTypes.STRING,
        notes: DataTypes.STRING,
        link: DataTypes.STRING,
        type: {
            type: DataTypes.ENUM(ProductDigitalAssetType.EXTERNAL, ProductDigitalAssetType.INTERNAL),
            defaultValue: ProductDigitalAssetType.EXTERNAL
        },
    },
    { tableName: 'product_digital_assets', timestamps: false },
);

// ProductDigitalAsset.belongsTo(Product, { foreignKey: 'product_id' });
