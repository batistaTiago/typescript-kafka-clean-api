import { VerificationCodeModel } from "../../infra/models/verification-code-model";
import { RandomNumberGenerator } from "../../utils/random-number-generator";
import { VerificationCode } from "../entities/verification-code";
import { VerificationCodeRepository } from "../services/repositories/verification-code-repository ";
import { GenerateVerificationCodeUseCase } from "../use-cases/generate-verification-code/generate-verification-code-use-case";
import { GenerateVerificationCodeController } from "./generate-verification-code-controller";

class FakeUseCase extends GenerateVerificationCodeUseCase {
    public async execute(): Promise<VerificationCodeModel> {
        return null;
    }
}

class FakeRandomNumberGenerator extends RandomNumberGenerator {
    public generate(): number {
        return 420;
    }
}

class FakeRepo implements VerificationCodeRepository {
    public async storeValidationCode(data: VerificationCode): Promise<VerificationCodeModel> {
        return null;
    }
}

describe('GenerateVerificationCodeController', () => {
    it('should forward call to the UseCase received as a parameter in constructor', async () => {
        const generator = new FakeRandomNumberGenerator();
        const repo = new FakeRepo();
        const useCase = new FakeUseCase(repo, generator);
        const useCaseExecutionSpy = jest.spyOn(useCase, 'execute');

        const sut = new GenerateVerificationCodeController(useCase);

        await sut.handle();
        expect(useCaseExecutionSpy).toHaveBeenCalled();
    })
})