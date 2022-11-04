import { inject, injectable } from "tsyringe";
import { RandomNumberGenerator } from "../../../utils/random-number-generator";
import { User } from "../../entities/user";
import { VerificationCode } from "../../entities/verification-code";
import { VerificationCodeRepository } from "../../services/repositories/verification-code-repository ";
import { UseCase } from "../use-case";

@injectable()
export class GenerateVerificationCodeUseCase implements UseCase {
    public constructor(
        @inject("VerificationCodeRepository") private readonly verificationCodeRepository: VerificationCodeRepository,
        @inject("RandomNumberGenerator") private readonly randomNumberGenerator: RandomNumberGenerator
    ) {}

    public async execute(user: User): Promise<VerificationCode> {
        try {
            const code = await this.verificationCodeRepository.findByUser(user);

            if (this.codeIsValid(code)) {
                return code;
            }
         
            return await this.createFromUser(user);
        } catch (error) {
            return await this.createFromUser(user);
        }
    }

    private async createFromUser(user: User): Promise<VerificationCode> {
        const now = new Date();
        const code = {
            code: String(this.randomNumberGenerator.generate({ digits: 7 })),
            expiresAt: new Date(now.setDate(now.getDate() + 1)),
            user: user
        };

        return await this.verificationCodeRepository.storeValidationCode(code);
    }

    private codeIsValid(code: VerificationCode): boolean {
        const now = new Date();
        const codeExpirationDate = new Date(code.expiresAt);

        return codeExpirationDate > now;
    }
}