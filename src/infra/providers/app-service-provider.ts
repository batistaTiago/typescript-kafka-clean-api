import { container } from 'tsyringe';
import { ServiceProvider } from '../../domain/services/provider';
import { RedisCache } from '../cache/redis-cache';
import { MongoEventRepository } from '../database/mongo/repositories/mongo-event-repository';
import { MongoVerificationCodeRepository } from '../database/mongo/repositories/mongo-verification-code-repository';
import { MysqlEventRepository } from '../database/mysql/repositories/mysql-event-repository';
import { NodeMailerAdapter } from '../mailing/node-mailer-adapter';
import { KafkaMessageProducerAdapter } from '../messaging/kafka/producer/kafka-message-producer-adapter';

export class AppServiceProvider implements ServiceProvider {
    public register(): void {
        container.register("MessageProducer", { useClass: KafkaMessageProducerAdapter });
        container.register("Cache", { useClass: RedisCache });
        container.register("Mailer", { useClass: NodeMailerAdapter });
        container.register("EventRepository", { useClass: MongoEventRepository });
        container.register("VerificationCodeRepository", { useClass: MongoVerificationCodeRepository });
    }
}