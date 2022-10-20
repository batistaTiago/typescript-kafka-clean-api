import { inject, injectable } from "tsyringe";
import { RandomNumberGenerator } from "../../../utils/random-number-generator";
import { VerificationCode } from "../../entities/verification-code";
import { Cache } from "../../services/cache/cache";
import { VerificationCodeRepository } from "../../services/repositories/verification-code-repository ";
import { UseCase } from "../use-case";

@injectable()
export class GenerateVerificationCodeUseCase implements UseCase {
    public constructor(
        @inject("VerificationCodeRepository") private readonly verificationCodeRepository: VerificationCodeRepository,
        @inject("Cache") private readonly cache: Cache,
        @inject("RandomNumberGenerator") private readonly randomNumberGenerator: RandomNumberGenerator
    ) {}

    public async execute(): Promise<VerificationCode> {
        const now = new Date();
        const code: VerificationCode = {
            code: String(this.randomNumberGenerator.generate({ digits: 7 })),
            expiresAt: new Date(now.setDate(now.getDate() + 1))
        };

        return await this.verificationCodeRepository.storeValidationCode(code);
    }
}