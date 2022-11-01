import { inject, injectable } from "tsyringe";
import { RandomNumberGenerator } from "../../../utils/random-number-generator";
import { User } from "../../entities/user";
import { VerificationCode } from "../../entities/verification-code";
import { UserRepository } from "../../services/repositories/user-repository";
import { VerificationCodeRepository } from "../../services/repositories/verification-code-repository ";
import { UseCase } from "../use-case";

@injectable()
export class GenerateVerificationCodeUseCase implements UseCase {
    public constructor(
        @inject("UserRepository") private readonly userRepository: UserRepository,
        @inject("VerificationCodeRepository") private readonly verificationCodeRepository: VerificationCodeRepository,
        @inject("RandomNumberGenerator") private readonly randomNumberGenerator: RandomNumberGenerator
    ) {}

    public async execute({ email }: { email: string }): Promise<VerificationCode> {
        const user = await this.userRepository.findByEmail(email);

        try {
            return await this.verificationCodeRepository.findByUser(user);
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
}