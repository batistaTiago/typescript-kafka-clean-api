import { inject, injectable } from "tsyringe";
import { LoginDTO } from "../../dto/user/login";
import { AppError } from "../../exceptions/app-error";
import { Encrypter } from "../../services/cryptography/encrypter";
import { HashCheck } from "../../services/cryptography/hash";
import { AccountRepository } from "../../services/repositories/user-repository";
import { UseCase } from "../use-case";

@injectable()
export class LoginUseCase implements UseCase {
    public constructor(
        @inject("UserRepository") private readonly userRepository: AccountRepository,
        @inject("HashCheck") private readonly hash: HashCheck,
        @inject("Encrypter") private readonly encrypter: Encrypter
    ) { }

    public async execute({ email, password }: LoginDTO): Promise<object> {
        const user = await this.userRepository.findAccountByEmail(email);
        if (!await this.hash.check(password, user.password)) {
            throw new AppError('Unauthorized');
        }

        return { accessToken: this.encrypter.encrypt({ id: user.id, issuedAt: new Date() }) };
    }
}