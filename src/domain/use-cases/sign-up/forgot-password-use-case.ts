import { inject, injectable } from "tsyringe";
import { RandomHelper } from "../../../utils/random-helper";
import { ForgotPasswordDTO } from "../../dto/user/forgot-password-dto";
import { Mailer } from "../../services/mailing/mailer";
import { PasswordRecoveryRepository } from "../../services/repositories/password-recovery-repository";
import { UserRepository } from "../../services/repositories/user-repository";
import { UseCase } from "../use-case";

@injectable()
export class ForgotPasswordUseCase implements UseCase {
    private static possibleChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private static codeSize = 8;

    public constructor(
        @inject('UserRepository') private readonly userRepository: UserRepository,
        @inject('PasswordRecoveryRepository') private readonly passwordRecoveryRepository: PasswordRecoveryRepository,
        @inject('Mailer') private readonly mailer: Mailer,
        private readonly randomHelper: RandomHelper,
    ) { }

    public async execute(data: ForgotPasswordDTO): Promise<object> {
        const user = await this.userRepository.findByEmail(data.email);
        const code = this.generateCode();
        const expiresAt = this.expirationDate();

        const storePromise = this.passwordRecoveryRepository.storeRecovery({ code, user, expiresAt });

        const sendPromise = this.mailer.send({
            message: code,
            subject: 'Forgot your password?'
        }, user.email);

        await Promise.all([storePromise, sendPromise]);

        return {
            success: true
        };
    }

    private generateCode(): string {
        let code = '';

        for (let i = 0; i < ForgotPasswordUseCase.codeSize; i++) {
            code += `${this.randomHelper.pick(ForgotPasswordUseCase.possibleChars)}`;
        }

        return code;
    }

    private expirationDate(): Date {
        const now = new Date();
        return new Date(now.setHours(now.getHours() + 1));
    }
}
