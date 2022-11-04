import { inject, singleton } from "tsyringe";
import { Environment } from "../../../config/environment";
import { AccessTokenData } from "../../dto/user/access-token-data";
import { UserAccount } from "../../dto/user/user-account";
import { Encrypter } from "../cryptography/encrypter";
import { UserRepository } from "../repositories/user-repository";

@singleton()
export class Authentication {
    private loggedUser?: UserAccount;

    public constructor(
        @inject("UserRepository") private readonly userRepository?: UserRepository,
        @inject("Encrypter") private readonly encrypter?: Encrypter
    ) { }

    public async authenticate(token: string) {
        const decrypted = this.encrypter.decrypt(token) as any;
        const accessTokenData = new AccessTokenData(decrypted.id, decrypted.issuedAt);

        if (this.tokenIsExpired(accessTokenData)) {
            throw new Error('Unauthenticated');
        }

        this.loggedUser = await this.userRepository.findAccountById(accessTokenData.id);
    }

    public user(): UserAccount {
        return this.loggedUser;
    }

    private tokenIsExpired({ issuedAt }: AccessTokenData): boolean {
        const now = new Date();
        const expirationDate = new Date(issuedAt.toISOString());
        expirationDate.setDate(expirationDate.getDate() + Environment.APP_AUTH_TOKEN_DURATION_DAYS);

        return expirationDate < now;
    }
}