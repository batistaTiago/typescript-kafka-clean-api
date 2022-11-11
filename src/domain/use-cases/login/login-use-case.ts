import { inject, injectable } from "tsyringe";
import { Environment } from "../../../config/environment";
import { generateAccessToken } from "../../../utils/access-token-generator";
import { LoginDTO } from "../../dto/user/login";
import { AppError } from "../../exceptions/app-error";
import { Encrypter } from "../../services/cryptography/encrypter";
import { HashCheck } from "../../services/cryptography/hash";
import { AccessTokenRepository } from "../../services/repositories/access-token-repository";
import { AccountRepository } from "../../services/repositories/user-repository";
import { UseCase } from "../use-case";

@injectable()
export class LoginUseCase implements UseCase {
    public constructor(
        @inject("UserRepository") private readonly userRepository: AccountRepository,
        @inject('AccessTokenRepository') private readonly accessTokenRepository: AccessTokenRepository,
        @inject("HashCheck") private readonly hash: HashCheck,
        @inject("Encrypter") private readonly encrypter: Encrypter
    ) { }

    public async execute({ email, password }: LoginDTO): Promise<object> {
        const user = await this.userRepository.findAccountByEmail(email);
        if (!await this.hash.check(password, user.password)) {
            throw new AppError('User and/or password are incorrect');
        }

        const accessToken = generateAccessToken(user, this.encrypter);

        await this.accessTokenRepository.storeToken({
            token: accessToken,
            expiresAt: this.defaultTokenExpirationDate(),
            isRevoked: false,
        });

        return { accessToken };
    }

    private defaultTokenExpirationDate(): Date {
        const output = new Date();
        output.setDate(output.getDate() + Environment.APP_AUTH_TOKEN_DURATION_DAYS);
        return output;
    }
}