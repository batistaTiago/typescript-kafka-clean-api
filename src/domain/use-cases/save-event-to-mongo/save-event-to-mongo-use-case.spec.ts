import { MessageProducer } from "../../services/messaging/message-producer";
import { HomeAccessUseCase } from "../home-access/home-access-use-case";

const mockedDate = new Date('2022-10-10');
jest.spyOn<any, any>(global, 'Date').mockImplementation(() => {
    return mockedDate;
});

class FakeProducer implements MessageProducer {
    publish(_: string, __: any): Promise<void> {
        return null;
    }
}

describe('ForwardInputToQueue', () => {
    it('Should call producer with the same input received', async () => {
        const fakeProducer = new FakeProducer();
        const publishSpy = jest.spyOn(fakeProducer, 'publish');

        const sut = new HomeAccessUseCase(fakeProducer);
        const sampleData = { key: 'value' };
        await sut.execute(sampleData);

        expect(publishSpy).toHaveBeenCalledTimes(1);
        expect(publishSpy).toHaveBeenCalledWith('events', {
            eventName: 'NEW_HOMEPAGE_ACCESS',
            happenedAt: mockedDate,
            data: sampleData,
        });
    });

    it('Should let exception go through if producer throws', async () => {
        const fakeProducer = new FakeProducer();
        const publishSpy = jest.spyOn(fakeProducer, 'publish')
            .mockImplementationOnce(() => {
                throw new Error('');
            });

        const sut = new HomeAccessUseCase(fakeProducer);
        const sampleData = { key: 'value' };
        const promise = sut.execute(sampleData);

        expect(publishSpy).toHaveBeenCalledTimes(1);
        expect(promise).rejects.toEqual(new Error(''));
    });
});