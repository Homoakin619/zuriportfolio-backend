import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from 'sequelize';
import { User, sequelizeInstance } from '.';

enum USER_TYPE {
    CUSTOMER = 'customer',
    ADMIN = 'admin'
}

export interface IActivity
    extends Model<InferAttributes<IActivity>, InferCreationAttributes<IActivity>> {
    id: CreationOptional<number>;
    user_id: string;
    action: string;
    title: string;
    description: string;
    // user_type: CreationOptional<string>;
    createdAt: CreationOptional<string>;
}

export const Activity = sequelizeInstance.define<IActivity>(
    'activity',
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
        action: { type: DataTypes.STRING },
        title: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
        // user_type: {
        //     type: DataTypes.ENUM(USER_TYPE.CUSTOMER, USER_TYPE.ADMIN),
        //     defaultValue: USER_TYPE.CUSTOMER
        // },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    { tableName: 'activity', timestamps: false },
);

Activity.belongsTo(User, { foreignKey: 'user_id' });
