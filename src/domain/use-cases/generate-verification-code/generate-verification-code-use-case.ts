import { inject, injectable } from "tsyringe";
import { VerificationCodeModel } from "../../../infra/models/verification-code-model";
import { RandomNumberGenerator } from "../../../utils/random-number-generator";
import { VerificationCode } from "../../entities/verification-code";
import { VerificationCodeRepository } from "../../services/repositories/verification-code-repository ";

interface GenerateVerificationCodeUseCaseArgs {
    min?: number;
    max?: number;
}

@injectable()
export class GenerateVerificationCodeUseCase {
    private min = 100000;
    private max = 999999;

    public constructor(
        @inject("VerificationCodeRepository") private readonly verificationCodeRepository: VerificationCodeRepository,
        @inject("Cache") private readonly cache: Cache,
        private readonly randomNumberGenerator: RandomNumberGenerator
    ) {}

    public async execute(): Promise<VerificationCodeModel> {
        const now = new Date();
        const code: VerificationCode = {
            code: String(this.randomNumberGenerator.generate({ digits: 7 })),
            expiresAt: new Date(now.setDate(now.getDate() + 1))
        };

        return await this.verificationCodeRepository.storeValidationCode(code);
    }
}