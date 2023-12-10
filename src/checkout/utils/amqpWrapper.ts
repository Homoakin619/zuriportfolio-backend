import amqp from 'amqplib'
import { logger } from '../config/logger'

export const QUEUE_NAME = "order-completed-queue"

class AmqpWrapper {
    private _connection?: amqp.Connection
    private _channel?: amqp.Channel

    get channel() {
        if (!this._channel) {
            throw new Error('Cannot access AMQP channel before connecting')
        }
        return this._channel
    }

    get connection() {
        if (!this._connection) {
            throw new Error('Cannot access AMQP connection before connecting')
        }
        return this._connection
    }

    async connectQueue(url: string = "amqp://localhost:5672") {
        try {
            this._connection = await amqp.connect(url)
            this._channel = await this._connection.createChannel()

            await this._channel.assertQueue(QUEUE_NAME)
            logger.info('Connected to AMQP!')
        } catch (error) {
            logger.error(error)
        }
    }
}

export const amqpWrapper = new AmqpWrapper()