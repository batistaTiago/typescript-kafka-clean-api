import { User } from "../entities/user";
import { Authentication } from "../services/auth/authentication";
import { GenerateVerificationCodeUseCase } from "../use-cases/generate-verification-code/generate-verification-code-use-case";
import { GenerateVerificationCodeController } from "./generate-verification-code-controller";

describe('GenerateVerificationCodeController', () => {
    it('should find user in auth singleton before calling the usecase', async () => {
        const email = 'some_email@test.dev';
        const name = 'username';
        const registrationDate = new Date();
        const returnMock = { code: '13510', expiresAt: new Date() };
        const user = { name, email, registrationDate, password: 'pass' };
        const auth = { user: (): User => user } as unknown as Authentication;
        const useCase = { execute: jest.fn().mockReturnValue(returnMock) } as unknown as GenerateVerificationCodeUseCase;

        const userSpy = jest.spyOn(auth, 'user');

        const sut = new GenerateVerificationCodeController(useCase, auth);

        await sut.handle();
        expect(userSpy).toHaveBeenCalled();
    });

    it('should forward call to the UseCase received as a parameter in constructor', async () => {
        const email = 'some_email@test.dev';
        const name = 'username';
        const registrationDate = new Date();
        const returnMock = { code: '13510', expiresAt: new Date() };
        const user = { name, email, registrationDate, password: 'pass' };
        const auth = { user: (): User => user } as unknown as Authentication;
        const useCase = { execute: jest.fn().mockReturnValue(returnMock) } as unknown as GenerateVerificationCodeUseCase;

        const useCaseExecutionSpy = jest.spyOn(useCase, 'execute');

        const sut = new GenerateVerificationCodeController(useCase, auth);

        await sut.handle();
        expect(useCaseExecutionSpy).toHaveBeenCalledWith(user);
    });
})