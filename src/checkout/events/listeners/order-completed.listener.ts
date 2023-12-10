import { messagingService } from "../../services"
import { activityService } from "../../services/activity.service"
import { orderAlert } from "../../services/order-alert.service"
import { shopInternalService } from "../../services/shop-internal.service"
import { QUEUE_NAME } from "../../utils/amqpWrapper"
import { OrderCompletedEvent } from "../order-completed.event"
import { Subjects } from "../subjects"
import { Listener } from "./listener"

export class OrderCompletedListener extends Listener<OrderCompletedEvent> {
  subject = Subjects.ORDERCOMPLETED
  queueName = QUEUE_NAME

  async processJob({ orderId }: OrderCompletedEvent['data']) {
    await messagingService.buyerOrderConfirmation(orderId);
    await messagingService.sellerOrderConfirmation(orderId);
    await messagingService.sellerPurchaseConfirmation(orderId);
    await messagingService.buyerPurchaseConfirmation(orderId);
    await activityService.recordActivity(orderId);
    await shopInternalService.trackPromo(orderId);
    await orderAlert.orderAlertService(orderId);
  }
}