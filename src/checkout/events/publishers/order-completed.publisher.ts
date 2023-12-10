import { OrderCompletedEvent } from "../order-completed.event"
import { Subjects } from "../subjects"
import { Publisher } from "./publisher"

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
    subject = Subjects.ORDERCOMPLETED
}