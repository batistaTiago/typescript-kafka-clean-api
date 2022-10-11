import { VerificationCodeModel } from "../../../infra/models/verification-code-model";
import { RandomNumberGenerator } from "../../../utils/random-number-generator";
import { VerificationCode } from "../../entities/verification-code";
import { VerificationCodeRepository } from "../../services/repositories/verification-code-repository ";

interface GenerateVerificationCodeUseCaseArgs {
    min?: number;
    max?: number;
}

export class GenerateVerificationCodeUseCase {
    private min = 100000;
    private max = 999999;

    public constructor(
        private readonly verificationCodeRepository: VerificationCodeRepository,
        private readonly randomNumberGenerator: RandomNumberGenerator
    ) {}

    public async execute(): Promise<VerificationCodeModel> {
        const now = new Date();
        const code: VerificationCode = {
            code: String(this.randomNumberGenerator.generate({min: 1000, max: })),
            expiresAt: new Date(now.setDate(now.getDate() + 1))
        };

        return await this.verificationCodeRepository.storeValidationCode(code);
    }
}