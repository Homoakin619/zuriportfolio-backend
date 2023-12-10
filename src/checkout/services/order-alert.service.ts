import axios from "axios";
import { logger } from "../config/logger";
import { ordersService } from "./orders.service";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

async function orderAlertService(orderId: string) {
    const endpointURL = 'https://team-mirage-super-amind2.onrender.com/api/v1/super-admin/analytics/user-purchase-activity/'
    const order = await ordersService.getOrderById(orderId);
    if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found!");
    
    const orderAlert = {
        order: orderId,
        user: order.customer_id,
        created_at: order.createdAt,
    }
    try {
		const response = await axios.post(endpointURL, orderAlert);
		logger.info('Order alert sent successfully.');
	} catch (error: any) {
		logger.error('Error sending order alert:', error);
	}
}

export const orderAlert = {
    orderAlertService
}
