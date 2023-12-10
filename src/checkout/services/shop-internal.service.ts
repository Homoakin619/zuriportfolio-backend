import axios from "axios";
import { logger } from "../config/logger";
import config from "../config";
import { orderItemsService } from "./order_items.service";

type TrackPromotionPayload = {
    promo_id: number,
    productId: string,
    merchant_id: string
}

async function trackPromo(orderId: string) {
    const orderItems = await orderItemsService.getOrderItemsWithPromo(orderId);
    orderItems.forEach((item) => {
        const payload: TrackPromotionPayload = {
            merchant_id: item.merchant_id,
            productId: item.product_id,
            promo_id: item.promo_id as number
        }
        send(payload);
    })
}

export const shopInternalService = {
    trackPromo
}

async function send(payload: TrackPromotionPayload) {
    const endpointURL = `${config.shop_internal_url}/discount/track`;
    try {
        const response = await axios.post(endpointURL, payload);
        logger.info('Promo tracked successfully.');
    } catch (error) {
        logger.error('Error tracking promo:', error);
    }
}