import 'reflect-metadata';
import { container } from 'tsyringe';
import { ApiApplication } from '../application/api-application';
import { Event } from '../domain/entities/event';
import { KafkaMessageProducerAdapter } from '../infra/messaging/kafka/producer/kafka-message-producer-adapter';

new ApiApplication().start().then(async() => {
    const event: Event = {
        eventName: 'SERVER_RESTART',
        happenedAt: new Date(),
        data: {
            port: 5000
        }
    };
    
    const producer = container.resolve(KafkaMessageProducerAdapter);
    await producer.connect();
    await producer.publish('events', event);
    
    console.log('Server restart event published successfully!');
    console.log('Server running...');
});