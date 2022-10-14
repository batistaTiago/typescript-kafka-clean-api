import { Producer } from "kafkajs";
import { KafkaMessageProducerAdapter } from "./kafka-message-producer-adapter";

describe('KafkaMessageProducerAdapter', () => {
    it('should hook connect and disconnect events on instantiation', () => {
        const producerMock = {
            on: jest.fn(),
        } as unknown as Producer;

        const onSpy = jest.spyOn(producerMock, 'on');
        new KafkaMessageProducerAdapter(producerMock);

        expect(onSpy).toHaveBeenCalledTimes(2);
    });

    it('should connect when sending the first message', async () => {
        const producerMock = {
            on: jest.fn(),
            send: jest.fn(),
            connect: jest.fn(),
        } as unknown as Producer;

        const connectSpy = jest.spyOn(producerMock, 'connect');
        const sut = new KafkaMessageProducerAdapter(producerMock);
        
        const sampleData = {};

        await sut.publish('topic-name', sampleData);
        await sut.publish('topic-name', sampleData);

        expect(connectSpy).toHaveBeenCalledTimes(1);
    });


    it('should forward publish call into client library send method', async () => {
        const producerMock = {
            on: jest.fn(),
            send: jest.fn(),
            connect: jest.fn(),
        } as unknown as Producer;

        const sendSpy = jest.spyOn(producerMock, 'send');
        const sut = new KafkaMessageProducerAdapter(producerMock);

        const sampleData = {};
        await sut.publish('topic-name', sampleData);

        expect(sendSpy).toHaveBeenCalledWith({
            topic: 'topic-name',
            messages: [
                {
                    key: 'key',
                    value: JSON.stringify(sampleData)
                }
            ]
        });
    });
});
