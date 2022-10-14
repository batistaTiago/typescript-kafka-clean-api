import 'reflect-metadata';
import { Application } from './application'
Application.boot();

import { container } from 'tsyringe';
import { EventTopicHandler } from "../infra/messaging/handlers/save-event-to-mongo-handler";
import { KafkaTopicConsumer } from "../infra/messaging/kafka/consumer/kafka-topic-consumer";

const handler = container.resolve(EventTopicHandler);
const consumer = container.resolve(KafkaTopicConsumer);

// @@TODO: topic name deve vir por parametro do script.
const TOPIC_NAME = 'events';

consumer.consume(TOPIC_NAME, handler).then(() => console.log('Worker rodando...'));