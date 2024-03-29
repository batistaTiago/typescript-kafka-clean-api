import { LoginUseCase } from "../../use-cases/login/login-use-case";
import { LoginController } from "./login-controller";

describe('LoginController', () => {
    it('should forward call into the usecase', async () => {
        const useCase = { execute: jest.fn() } as unknown as LoginUseCase;
        const executeSpy = jest.spyOn(useCase, 'execute');

        const sut = new LoginController(useCase);
        await sut.handle({ body: { some: 'data' } });

        expect(executeSpy).toHaveBeenCalledWith({ some: 'data' });
    });
});