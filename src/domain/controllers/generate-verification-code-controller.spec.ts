import { VerificationCodeModel } from "../../infra/models/verification-code-model";
import { RandomNumberGenerator } from "../../utils/random-number-generator";
import { VerificationCode } from "../entities/verification-code";
import { Cache } from "../services/cache/cache";
import { VerificationCodeRepository } from "../services/repositories/verification-code-repository ";
import { GenerateVerificationCodeUseCase } from "../use-cases/generate-verification-code/generate-verification-code-use-case";
import { GenerateVerificationCodeController } from "./generate-verification-code-controller";

class FakeUseCase extends GenerateVerificationCodeUseCase {
    public async execute(): Promise<VerificationCode> {
        return {
            code: '13510',
            expiresAt: new Date()
        };
    }
}

class FakeRandomNumberGenerator implements RandomNumberGenerator {
    public generate(): number {
        return 420;
    }
}

class FakeRepo implements VerificationCodeRepository {
    public async storeValidationCode(data: VerificationCode): Promise<VerificationCodeModel> {
        return null;
    }
}

class FakeCache implements Cache {
    has(key: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    get(key: string): Promise<string | object> {
        throw new Error("Method not implemented.");
    }
    set(key: string, data: string | object): Promise<void> {
        throw new Error("Method not implemented.");
    }
    forget(key: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

describe('GenerateVerificationCodeController', () => {
    it('should forward call to the UseCase received as a parameter in constructor', async () => {
        const generator = new FakeRandomNumberGenerator();
        const repo = new FakeRepo();
        const cache = new FakeCache();
        const useCase = new FakeUseCase(repo, cache, generator);
        const useCaseExecutionSpy = jest.spyOn(useCase, 'execute');

        const sut = new GenerateVerificationCodeController(useCase);

        await sut.handle();
        expect(useCaseExecutionSpy).toHaveBeenCalled();
    })
})