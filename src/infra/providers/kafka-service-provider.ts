import { container } from 'tsyringe';
import { Kafka as KafkaJS } from 'kafkajs';
import Environment from '../../application/environment';
import { ServiceProvider } from '../../domain/services/provider';

export class KafkaServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {   
        container.registerInstance(KafkaJS, new KafkaJS({
            clientId: Environment.APP_NAME,
            brokers: Environment.KAFKA_BROKERS,
            logLevel: 0
        }));
    }
}