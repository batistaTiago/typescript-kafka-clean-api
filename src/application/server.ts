import 'reflect-metadata';
import { Application } from './application'
Application.boot();


import { container } from 'tsyringe';
import { Event } from "../domain/entities/event";
import { KafkaMessageProducer } from "../infra/messaging/kafka/producer/kafka-message-producer";
import express, { Express } from 'express';
import { HomeControllerExpressAdapter } from '../infra/http/express/home-controller-express-adapter';

function startServer(producer: KafkaMessageProducer, api: Express): void {
    producer.connect()
        .then(() => {
            const event: Event = {
                eventName: 'SERVER_RESTART',
                happened_at: new Date(),
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
api.get('/', (req, res) => homeController.handle(req, res));

startServer(producer, api);