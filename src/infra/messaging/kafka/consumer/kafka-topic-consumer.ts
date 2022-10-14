import { Consumer as KafkaJSConsumer } from 'kafkajs';
import { injectable } from 'tsyringe';
import { MessageHandler } from '../../../../domain/services/messaging/message-handler';
import { KafkaBroker } from '../kafka-broker';

@injectable()
export class KafkaTopicConsumer {
    private readonly consumer: KafkaJSConsumer;
    private isConnected: boolean = false;
    private broker: KafkaBroker;

    private static NUMBER_OF_MESSAGES_BEFORE_COMMIT = 1;

    public constructor(broker: KafkaBroker) {
        this.broker = broker;
        this.consumer = this.broker.makeConsumer();
        this.setUpConnectionSyncing();
    }

    public async connect(): Promise<void> {
        if (!this.isConnected) {
            console.log('Consumer connecting...');
            await this.consumer.connect();
        }
    }

    public async consume(topic: string, handler: MessageHandler, fromBeginning: boolean = true): Promise<void> {
        await this.connect();
        await this.consumer.subscribe({ topic, fromBeginning });
        await this.consumer.run({
            autoCommitThreshold: KafkaTopicConsumer.NUMBER_OF_MESSAGES_BEFORE_COMMIT,
            eachMessage: async ({ message }) => {        
                console.log(`New message detected on topic ${topic}`);
                handler.handle(JSON.parse(String(message.value)))
            },
        });
    }

    private setUpConnectionSyncing(): void {
        this.consumer.on('consumer.connect', () => this.isConnected = true);
        this.consumer.on('consumer.disconnect', () => this.isConnected = false);
    }
}
