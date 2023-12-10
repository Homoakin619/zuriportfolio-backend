import { CreationAttributes } from 'sequelize';
import { Activity } from '../models';
import { IActivity } from '../models/activity.model';
import { orderItemsService } from './order_items.service';
import { logger } from '../config/logger';

async function recordActivity(orderId: string) {
    const orderItems = await orderItemsService.getOrderItems(orderId);
    const dto: CreationAttributes<IActivity>[] = orderItems.map(orderItem => ({
        user_id: orderItem.merchant_id,
        action: 'Order_Placed',
        title: `Order placed on ${orderItem.product?.name}`,
        description: `${orderItem.product?.name} was purchased by ${orderItem.customer?.email}.`
    }))
    const newActivity = await Activity.bulkCreate(dto);
    logger.info('Recorded activities succesfully!')
    return newActivity;
}

export const activityService = {
    recordActivity,
};
