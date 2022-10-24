import { container } from 'tsyringe';
import { Cache } from '../../domain/services/cache/cache';
import { Mailer } from '../../domain/services/mailing/mailer';
import { MessageProducer } from '../../domain/services/messaging/message-producer';
import { ServiceProvider } from '../../domain/services/provider';
import { DiceRoller } from '../../utils/dicer-roller';
import { RandomHelper } from '../../utils/random-helper';
import { RandomNumberGenerator } from '../../utils/random-number-generator';
import { RedisCache } from '../cache/redis-cache';
import { NodeMailerAdapter } from '../mailing/node-mailer-adapter';
import { KafkaMessageProducerAdapter } from '../messaging/kafka/producer/kafka-message-producer-adapter';

export class AppServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        container.register<MessageProducer>("MessageProducer", { useClass: KafkaMessageProducerAdapter });
        container.register<Cache>("Cache", { useClass: RedisCache });
        container.register<Mailer>("Mailer", { useClass: NodeMailerAdapter });
        container.register<RandomNumberGenerator>("RandomNumberGenerator", { useClass: RandomHelper });
        container.register<DiceRoller>("DiceRoller", { useClass: RandomHelper });
    }
}