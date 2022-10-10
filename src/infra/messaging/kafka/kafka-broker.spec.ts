import { KafkaBroker } from './kafka-broker';

const createKafkaMock = () => {
    return {
        producer(): any {},
        consumer(options: any): any {},
        admin: null as any,
        logger: null as any,
    };
}

describe('KafkaBroker', () => {
    it('should do forward makeProducer calls to the client library producer method', () => {
        const kafkaMock = createKafkaMock();
        const sut = new KafkaBroker(kafkaMock);
        const producerMock = jest.spyOn(kafkaMock, 'producer');

        sut.makeProducer();
        
        expect(producerMock).toHaveBeenCalledTimes(1);
    });

    it('should do forward makeConsumer calls to the client library consumer method', () => {
        const kafkaMock = createKafkaMock();
        const sut = new KafkaBroker(kafkaMock);
        const consumerMock = jest.spyOn(kafkaMock, 'consumer');

        sut.makeConsumer();
        
        expect(consumerMock).toHaveBeenCalledTimes(1);
    });
});