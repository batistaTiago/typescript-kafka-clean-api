import 'reflect-metadata';
import { Application } from './application'
Application.boot();


import { container } from 'tsyringe';
import { Event } from "../domain/entities/event";
import { KafkaMessageProducer } from "../infra/messaging/kafka/producer/kafka-message-producer";
import express, { Express } from 'express';
import { HomeControllerExpressAdapter } from '../infra/http/express/home-controller-express-adapter';
import { GenerateVerificationCodeControllerExpressAdapter } from '../infra/http/express/generate-verification-code-controller-express-adapter copy';

function startServer(producer: KafkaMessageProducer, api: Express): void {
    producer.connect()
        .then(() => {
            const event: Event = {
                eventName: 'SERVER_RESTART',
                happenedAt: new Date(),
                data: {
                    port: 5000
                }
            }
            producer.publish('events', event)
                .then(() => {
                    console.log('Server restart event published successfully!');
                    api.listen(5000, () => console.log('Server running!'))
                });
        });
}

const api = express();
api.set('trust proxy', true);

const producer = container.resolve(KafkaMessageProducer);
const homeController = container.resolve(HomeControllerExpressAdapter);
const verificationController = container.resolve(GenerateVerificationCodeControllerExpressAdapter);

api.get('/', (req, res) => homeController.handle(req, res));
api.get('/verification-code', (req, res) => verificationController.handle(req, res));

startServer(producer, api);