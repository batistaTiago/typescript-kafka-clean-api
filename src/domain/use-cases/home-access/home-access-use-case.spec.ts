import { MessageProducer } from "../../services/messaging/message-producer"
import { HomeAccessUseCase } from "./home-access-use-case";

const mockedDate = new Date('2022-10-10');
jest.spyOn<any, any>(global, 'Date').mockImplementation(() => {
    return mockedDate;
});

class FakeMessageProducer implements MessageProducer {
    public async publish(..._): Promise<void> {}
}

describe('HomeAccessUseCase', () => {
    it('should call publisher with topic name, current datetime and request ip', async () => {
        const fakeProducer = new FakeMessageProducer();
        const publishSpy = jest.spyOn(fakeProducer, 'publish');

        const expectedResult = {
            body: {
                eventName: "NEW_HOMEPAGE_ACCESS", 
                happenedAt: mockedDate,
                data: {
                    ip: "10.0.0.1"
                }, 
            }
        };

        const sut = new HomeAccessUseCase(fakeProducer);
        await sut.execute({ ip: '10.0.0.1'});

        expect(publishSpy).toHaveBeenCalledWith("events", expectedResult);
    })
})