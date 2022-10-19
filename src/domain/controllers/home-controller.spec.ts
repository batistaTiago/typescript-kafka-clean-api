import { MessageProducer } from "../services/messaging/message-producer";
import { HomeAccessUseCase } from "../use-cases/home-access/home-access-use-case";
import { HomeController } from "./home-controller"

describe('HomeController', () => {
    it('should forward call to the UseCase received as a parameter in constructor', async () => {
        const useCase = {
            execute: jest.fn()
        } as unknown as HomeAccessUseCase;
        const useCaseExecutionSpy = jest.spyOn(useCase, 'execute');

        const sut = new HomeController(useCase);

        await sut.handle({ ip: '127.0.0.1' });
        expect(useCaseExecutionSpy).toHaveBeenCalledWith({ ip: '127.0.0.1' });
    });

    it('should throw an error if usecase throws', () => {
        const useCase = {
            execute: jest.fn().mockImplementation(() => {
                throw new Error('some error that occurs randomly')
            })
        } as unknown as HomeAccessUseCase;
        const useCaseExecutionSpy = jest.spyOn(useCase, 'execute');

        const sut = new HomeController(useCase);

        const promise = sut.handle({ ip: '127.0.0.1' });
        expect(promise).rejects.toThrow(new Error('some error that occurs randomly'));
    });
})