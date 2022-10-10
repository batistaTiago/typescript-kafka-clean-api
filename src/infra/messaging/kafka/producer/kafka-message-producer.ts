import {  Producer as KafkaJSProducer, logLevel as KafkaJSLogLevel  } from 'kafkajs';
import { injectable } from 'tsyringe';
import { MessageProducer } from '../../../../domain/services/messaging/message-producer';
import { KafkaBroker } from '../kafka-broker';

@injectable()
export class KafkaMessageProducer implements MessageProducer {
    private readonly producer: KafkaJSProducer;
    private isConnected: boolean = false;

    public constructor(private broker: KafkaBroker) {
        this.producer = this.broker.makeProducer();
        this.setUpConnectionSyncing();
    }

    public async connect(): Promise<void> {
        if (!this.isConnected) {
            console.log('Producer connecting...');
            await this.producer.connect();
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
