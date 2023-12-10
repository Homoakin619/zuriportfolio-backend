import amqp from 'amqplib'
import { Subjects } from '../subjects'
import { QUEUE_NAME } from '../../utils/amqpWrapper'
import { logger } from '../../config/logger'

interface Event {
    subject: Subjects
    data: any
}

export abstract class Publisher<T extends Event> {
    abstract subject: T['subject']
    protected channel: amqp.Channel

    constructor(channel: amqp.Channel) {
        this.channel = channel
    }
    async publish(data: T['data']) {
        await this.channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)))
        logger.info(`Publisher: Event published to queue ${QUEUE_NAME}`)
    }
}