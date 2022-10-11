import { VerificationCodeModel } from "../../../infra/models/verification-code-model";
import { RandomNumberGenerator } from "../../../utils/random-number-generator";
import { VerificationCode } from "../../entities/verification-code";
import { VerificationCodeRepository } from "../../services/repositories/verification-code-repository ";
import { GenerateVerificationCodeUseCase } from "./generate-verification-code-use-case";

class FakeRandomNumberGenerator extends RandomNumberGenerator {
    public generate(): number {
        return 420;
    }
}

class FakeRepo implements VerificationCodeRepository {
    storeValidationCode(data: VerificationCode): Promise<VerificationCodeModel> {
        return null;
    }
}

describe('GenerateVerificationCodeUseCase', () => {
    it('should call its generator', async () => {
        const generator = new FakeRandomNumberGenerator();
        const repo = new FakeRepo();

        const generatorSpy = jest.spyOn(generator, 'generate');

        const sut = new GenerateVerificationCodeUseCase(repo, generator);

        await sut.execute();
        
        expect(generatorSpy).toHaveBeenCalled();
    });

    it('should call its repository', async () => {
        const generator = new FakeRandomNumberGenerator();
        const repo = new FakeRepo();

        const generatorSpy = jest.spyOn(repo, 'storeValidationCode');

        const sut = new GenerateVerificationCodeUseCase(repo, generator);

        await sut.execute();
        
        expect(generatorSpy).toHaveBeenCalled();
    });
});
