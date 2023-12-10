import { Subjects } from "./subjects"

export interface OrderCompletedEvent {
    subject: Subjects.ORDERCOMPLETED
    data: {
        orderId: string
    }
}