import { inject, injectable } from "tsyringe";
import { PasswordRecoveryDTO } from "../../dto/user/password-recovery-dto";
import { AppError } from "../../exceptions/app-error";
import { HashMake } from "../../services/cryptography/hash";
import { PasswordRecoveryRepository } from "../../services/repositories/password-recovery-repository";
import { UserRepository } from "../../services/repositories/user-repository";
import { UseCase } from "../use-case";

@injectable()
export class PasswordRecoveryUseCase implements UseCase {
    public constructor(
        @inject('UserRepository') private readonly userRepository: UserRepository,
        @inject('PasswordRecoveryRepository') private readonly passwordRecoveryRepository: PasswordRecoveryRepository,
        @inject('HashMake') private readonly hash: HashMake
    ) { }

    public async execute(data: PasswordRecoveryDTO): Promise<object> {
        const recovery = await this.passwordRecoveryRepository.findRecovery(data.code, data.email);

        if (recovery.expiresAt < new Date()) {
            throw new AppError('Invalid code, please try again');
        }

        const hashedPassword = await this.hash.make(data.password);
        
        const updatePromise = this.userRepository.updateAccountByEmail(data.email, { password: hashedPassword });
        const markAsUsedPromise = this.passwordRecoveryRepository.markAsUsed(recovery.id);

        await Promise.all([updatePromise, markAsUsedPromise]);

        return { success: true };
    }

}
