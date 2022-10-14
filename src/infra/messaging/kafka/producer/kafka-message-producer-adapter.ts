import {  Producer as KafkaJSProducer, logLevel as KafkaJSLogLevel  } from 'kafkajs';
import { inject, injectable } from 'tsyringe';
import { MessageProducer } from '../../../../domain/services/messaging/message-producer';

@injectable()
export class KafkaMessageProducerAdapter implements MessageProducer {
    private readonly producer: KafkaJSProducer
    private isConnected: boolean = false;

    public constructor(@inject('KafkaJSProducer') producer: KafkaJSProducer) {
        this.producer = producer;
        this.setUpConnectionSyncing();
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

    private setUpConnectionSyncing(): void {
        this.producer.on('producer.connect', () => this.isConnected = true);
        this.producer.on('producer.disconnect', () => this.isConnected = false);
    }
}
