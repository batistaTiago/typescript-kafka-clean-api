import { container } from 'tsyringe';
import {  Kafka as KafkaJS, Consumer as KafkaJSConsumer, Producer as KafkaJSProducer, logLevel as KafkaJSLogLevel } from 'kafkajs';
import { ServiceProvider } from '../../domain/services/provider';
import { RandomNumberGenerator } from '../../utils/random-number-generator';
import { Environment } from '../../config/environment';

export class KafkaServiceProvider implements ServiceProvider {
    private kafkaJS: KafkaJS;

    public constructor() {
        this.kafkaJS = new KafkaJS({
            clientId: Environment.APP_NAME,
            brokers: Array(...Environment.KAFKA_BROKERS.split(',')),
            logLevel: KafkaJSLogLevel.NOTHING
        });
    }

    public register(): void {   
        container.registerInstance(KafkaJS, this.kafkaJS);
        container.registerInstance<KafkaJSProducer>('KafkaJSProducer', this.kafkaJS.producer());
        container.register<KafkaJSConsumer>('KafkaJSConsumer', { useValue: this.makeConsumer() });
    }

    private makeConsumer(): KafkaJSConsumer {
        let groupId = `${Environment.KAFKA_CONSUMER_BASE_GROUP_ID}_`;
        
        if (Environment.KAFKA_CONSUMER_GROUP_ID) {
            groupId += Environment.KAFKA_CONSUMER_GROUP_ID;
        } else {
            const rng = new RandomNumberGenerator();
            const random =  rng.generate({ digits: 4 });
            groupId += `${random}`;
        }

        console.log(`Registering consumer with groupId ${groupId}`);

        return this.kafkaJS.consumer({
            groupId: groupId,
            minBytes: Number(Environment.KAFKA_CONSUMER_MIN_BYTES),
            maxBytes: Number(Environment.KAFKA_CONSUMER_MAX_BYTES),
            maxWaitTimeInMs: Number(Environment.KAFKA_CONSUMER_MAX_WAIT_TIME_MS),
        });
    }
}