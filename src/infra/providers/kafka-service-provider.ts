import { container } from 'tsyringe';
import { Kafka as KafkaJS, Consumer as KafkaJSConsumer, Producer as KafkaJSProducer, logLevel as KafkaJSLogLevel } from 'kafkajs';
import { ServiceProvider } from '../../domain/services/provider';
import { RandomHelper } from '../../utils/random-helper';
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
        container.registerInstance(KafkaJS, this.kafkaJS); // @@ TODO: ver se eh necessario disponibilizar isso no container ou se os 2 abaixo atendem tudo
        container.registerInstance<KafkaJSProducer>('KafkaJSProducer', this.kafkaJS.producer());
        container.register<KafkaJSConsumer>('KafkaJSConsumer', { useValue: this.makeConsumer() });
    }

    private makeConsumer(): KafkaJSConsumer {
        return this.kafkaJS.consumer({
            groupId: this.groupId(),
            minBytes: Number(Environment.KAFKA_CONSUMER_MIN_BYTES),
            maxBytes: Number(Environment.KAFKA_CONSUMER_MAX_BYTES),
            maxWaitTimeInMs: Number(Environment.KAFKA_CONSUMER_MAX_WAIT_TIME_MS),
        });
    }

    private groupId(): string {
        let groupId = `${Environment.KAFKA_CONSUMER_BASE_GROUP_ID}_`;

        if (Environment.KAFKA_CONSUMER_GROUP_ID) {
            groupId += Environment.KAFKA_CONSUMER_GROUP_ID;
        } else {
            const rng = new RandomHelper();
            const random =  rng.generate({ digits: 12 });
            groupId += `${random}`;
        }

        return groupId;
    }
}