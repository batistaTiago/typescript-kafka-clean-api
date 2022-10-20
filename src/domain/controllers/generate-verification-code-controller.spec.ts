import { GenerateVerificationCodeUseCase } from "../use-cases/generate-verification-code/generate-verification-code-use-case";
import { GenerateVerificationCodeController } from "./generate-verification-code-controller";

describe('GenerateVerificationCodeController', () => {
    it('should forward call to the UseCase received as a parameter in constructor', async () => {
        const useCase = {
            execute: jest.fn().mockReturnValue({ code: '13510', expiresAt: new Date() }),
        } as unknown as GenerateVerificationCodeUseCase;
        const useCaseExecutionSpy = jest.spyOn(useCase, 'execute');

        const sut = new GenerateVerificationCodeController(useCase);

        await sut.handle();
        expect(useCaseExecutionSpy).toHaveBeenCalled();
    })
})