import 'reflect-metadata';
import { container } from 'tsyringe';
import { ApiApplication } from '../application/api-application';
import { Environment } from '../config/environment';
import { Event } from '../domain/entities/event';
import { Events } from '../domain/enums/events';
import { Message } from '../domain/services/messaging/message';
import { KafkaMessageProducerAdapter } from '../infra/messaging/kafka/producer/kafka-message-producer-adapter';

new ApiApplication().start().then(async() => {
    // @@TODO mover para ApiApplication.start()
    const event: Message<Event> = {
        body: {
            eventName: Events.NEW_HOMEPAGE_ACCESS,
            happenedAt: new Date(),
            data: {
                port: Environment.API_PORT
            }
        },
    };
    
    const producer = container.resolve(KafkaMessageProducerAdapter);
    await producer.connect();
    await producer.publish('events', event);
    
    console.log('Server restart event published successfully!');
    console.log('Server running...');
});
