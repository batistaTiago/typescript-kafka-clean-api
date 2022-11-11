import { container } from 'tsyringe';
import { Cache } from '../../domain/services/cache/cache';
import { HttpClient } from '../../domain/services/http/http-client';
import { Mailer } from '../../domain/services/mailing/mailer';
import { MessageProducer } from '../../domain/services/messaging/message-producer';
import { ServiceProvider } from '../../domain/services/provider';
import { DiceRoller } from '../../domain/services/randomizer/dicer-roller';
import { RandomHelper } from '../../utils/random-helper';
import { RandomNumberGenerator } from '../../domain/services/randomizer/random-number-generator';
import { RedisCache } from '../cache/redis-cache';
import { AxiosHttpClientAdapter } from '../http/client/axios-http-client-adapter';
import { NodeMailerAdapter } from '../mailing/node-mailer-adapter';
import { KafkaMessageProducerAdapter } from '../messaging/kafka/producer/kafka-message-producer-adapter';
import { Authentication } from '../../domain/services/auth/authentication';

export class AppServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        container.register<HttpClient>("HttpClient", { useClass: AxiosHttpClientAdapter });
        container.register<MessageProducer>("MessageProducer", { useClass: KafkaMessageProducerAdapter });
        container.register<Cache>("Cache", { useClass: RedisCache });
        container.register<Mailer>("Mailer", { useClass: NodeMailerAdapter });
        container.register<RandomNumberGenerator>("RandomNumberGenerator", { useClass: RandomHelper });
        container.register<DiceRoller>("DiceRoller", { useClass: RandomHelper });
    }
}