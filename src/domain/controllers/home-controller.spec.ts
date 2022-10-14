import { MessageProducer } from "../services/messaging/message-producer";
import { HomeAccessUseCase } from "../use-cases/home-access/home-access-use-case";
import { HomeController } from "./home-controller"

class FakeMessageProducer implements MessageProducer {
    public async publish(topicName: string, data: object): Promise<void> {}
}

class FakeUseCase extends HomeAccessUseCase {}

describe('HomeController', () => {
    it('should forward call to the UseCase received as a parameter in constructor', async () => {
        const fakeProducer = new FakeMessageProducer();
        const useCase = new FakeUseCase(fakeProducer);
        const useCaseExecutionSpy = jest.spyOn(useCase, 'execute');

        const sut = new HomeController(useCase);

        await sut.handle({ ip: '127.0.0.1' });
        expect(useCaseExecutionSpy).toHaveBeenCalledWith({ ip: '127.0.0.1' });
    })
})