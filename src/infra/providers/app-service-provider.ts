import { container } from 'tsyringe';
import { ServiceProvider } from '../../domain/services/provider';
import { KafkaMessageProducer } from '../messaging/kafka/producer/kafka-message-producer';

export class AppServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {   
        container.register("MessageProducer", {
            useClass: KafkaMessageProducer
          });
    }
}