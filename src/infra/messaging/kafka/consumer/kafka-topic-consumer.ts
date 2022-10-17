import { Consumer as KafkaJSConsumer } from 'kafkajs';
import { inject, injectable } from 'tsyringe';
import { MessageHandler } from '../../../../domain/services/messaging/message-handler';
import { KafkaMessageProducerAdapter } from '../producer/kafka-message-producer-adapter';

@injectable()
export class KafkaTopicConsumer {
    private static readonly NUMBER_OF_MESSAGES_BEFORE_COMMIT = 1;

    private isConnected: boolean = false;

    public constructor(
        @inject('KafkaJSConsumer') private readonly consumer: KafkaJSConsumer,
        private readonly producer: KafkaMessageProducerAdapter
    ) {
        this.consumer.on('consumer.connect', () => this.isConnected = true);
        this.consumer.on('consumer.disconnect', () => this.isConnected = false);
    }

    public async consume(topic: string, handler: MessageHandler, fromBeginning: boolean = true): Promise<void> {
        await this.connect();
        await this.consumer.subscribe({ topic, fromBeginning });
        await this.consumer.run({
            autoCommitThreshold: KafkaTopicConsumer.NUMBER_OF_MESSAGES_BEFORE_COMMIT,
            eachMessage: async ({ message }) => {
                console.log(`New message detected on topic ${topic}`);
                const messageData = JSON.parse(String(message.value));

                try {
                    await handler.handle(messageData);
                    console.log(`Message handled successfully`);
                } catch (error) {
                    const originalTopicName = topic.includes('.') ? topic.split('.')[0] : topic;
                    const forwardTopicName = topic.includes('retry') ? `dlq.${originalTopicName}` : `retry.${originalTopicName}`;
                    console.log(`Error (${error.message}) while handling message, forwarding to topic: ${forwardTopicName}`);
                    await this.producer.publish(forwardTopicName, messageData);
                }
            },
        });
    }

    public async connect(): Promise<void> {
        if (!this.isConnected) {
            console.log('Consumer connecting...');
            await this.consumer.connect();
        }
    }
}
