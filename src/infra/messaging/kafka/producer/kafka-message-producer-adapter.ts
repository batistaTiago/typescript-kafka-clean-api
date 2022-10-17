import {  Producer as KafkaJSProducer, logLevel as KafkaJSLogLevel  } from 'kafkajs';
import { inject, singleton } from 'tsyringe';
import { MessageProducer } from '../../../../domain/services/messaging/message-producer';

@singleton()
export class KafkaMessageProducerAdapter implements MessageProducer {
    private isConnected: boolean = false;

    public constructor(@inject('KafkaJSProducer') private readonly producer: KafkaJSProducer) {
        this.producer.on('producer.connect', () => this.isConnected = true);
        this.producer.on('producer.disconnect', () => this.isConnected = false);
    }

    public async connect(): Promise<void> {
        if (!this.isConnected) {
            console.log('ProducerAdapter connecting...');
            await this.producer.connect();
            this.isConnected = true;
        }
    }

    public async publish(topic: string, data: object, key?: string): Promise<void> {
        await this.connect();
        await this.producer.send({
            topic,
            messages: [{
                key: key ?? 'key',
                value: JSON.stringify(data)
            }]
        });
    }
}
