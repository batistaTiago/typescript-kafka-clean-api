import { container } from 'tsyringe';
import { ServiceProvider } from '../../domain/services/provider';
import { RedisCache } from '../cache/redis-cache';
import { MongoEventRepository } from '../database/mongo/repositories/mongo-event-repository';
import { MongoVerificationCodeRepository } from '../database/mongo/repositories/mongo-verification-code-repository';
import { NodeMailerAdapter } from '../mailing/node-mailer-adapter';
import { KafkaMessageProducer } from '../messaging/kafka/producer/kafka-message-producer';

export class AppServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        container.register("MessageProducer", { useClass: KafkaMessageProducer });
        container.register("Cache", { useClass: RedisCache });
        container.register("Mailer", { useClass: NodeMailerAdapter });
        container.register("MongoEventRepository", { useClass: MongoEventRepository });
        container.register("VerificationCodeRepository", { useClass: MongoVerificationCodeRepository });
    }
}