import { Consumer } from "kafkajs";
import { MessageHandler } from "../../../../domain/services/messaging/message-handler";
import { KafkaTopicConsumer } from "./kafka-topic-consumer";

const makeConsumerMock = () => (({
    on: jest.fn(),
    connect: jest.fn(),
    subscribe: jest.fn(),
    run: jest.fn(),
} as unknown) as Consumer);

describe('KafkaTopicConsumer', () => {
    it('should hook connect and disconnect events on instantiation', () => {
        const consumerMock = makeConsumerMock();
        const producerMock = {} as any;

        const onSpy = jest.spyOn(consumerMock, 'on');
        new KafkaTopicConsumer(consumerMock, producerMock);

        expect(onSpy).toHaveBeenCalledTimes(2);
    });

    it('should connect to topic on consume call', async () => {
        const consumerMock = makeConsumerMock();
        const producerMock = {} as any;

        const fakeHandler: MessageHandler = {
            handle: jest.fn()
        }

        const connectSpy = jest.spyOn(consumerMock, 'connect');
        const sut = new KafkaTopicConsumer(consumerMock, producerMock);

        await sut.consume('sample', fakeHandler);

        expect(connectSpy).toHaveBeenCalledTimes(1);
    });
});
