import { inject, injectable } from "tsyringe";
import { RandomHelper } from "../../../utils/random-helper";
import { ForgotPasswordDTO } from "../../dto/user/forgot-password-dto";
import { HashMake } from "../../services/cryptography/hash";
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
        @inject('HashMake') private readonly hash: HashMake
    ) { }

    public async execute(data: object): Promise<object> {
        return;
    }

}
