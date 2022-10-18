import { container } from 'tsyringe';
import { Cache } from '../../domain/services/cache/cache';
import { Mailer } from '../../domain/services/mailing/mailer';
import { MessageProducer } from '../../domain/services/messaging/message-producer';
import { ServiceProvider } from '../../domain/services/provider';
import { EventRepository } from '../../domain/services/repositories/event-repository';
import { VerificationCodeRepository } from '../../domain/services/repositories/verification-code-repository ';
import { RandomHelper } from '../../utils/random-helper';
import { RandomNumberGenerator } from '../../utils/random-number-generator';
import { RedisCache } from '../cache/redis-cache';
import { MongoEventRepository } from '../database/mongo/repositories/mongo-event-repository';
import { MongoVerificationCodeRepository } from '../database/mongo/repositories/mongo-verification-code-repository';
import { MysqlEventRepository } from '../database/mysql/repositories/mysql-event-repository';
import { NodeMailerAdapter } from '../mailing/node-mailer-adapter';
import { KafkaMessageProducerAdapter } from '../messaging/kafka/producer/kafka-message-producer-adapter';

export class AppServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        container.register<MessageProducer>("MessageProducer", { useClass: KafkaMessageProducerAdapter });
        container.register<Cache>("Cache", { useClass: RedisCache });
        container.register<Mailer>("Mailer", { useClass: NodeMailerAdapter });
        container.register<RandomNumberGenerator>("RandomNumberGenerator", { useClass: RandomHelper });
        // container.register<EventRepository>("EventRepository", { useClass: MongoEventRepository });
        container.register<EventRepository>("EventRepository", { useClass: MysqlEventRepository });
        container.register<VerificationCodeRepository>("VerificationCodeRepository", { useClass: MongoVerificationCodeRepository });
    }
}