import { inject, singleton } from "tsyringe";
import { User } from "../../../infra/database/mysql/entities/user.entity";
import { UserAccount } from "../../dto/user/user-account";
import { AccessToken } from "../../entities/access-token";
import { Encrypter } from "../cryptography/encrypter";
import { UserRepository } from "../repositories/user-repository";

@singleton()
export class Authentication {
    private loggedUser?: UserAccount;

    public constructor(
        @inject("UserRepository") private readonly userRepository?: UserRepository,
        @inject("Encrypter") private readonly encrypter?: Encrypter
    ) { }

    public async authenticate(accessToken: AccessToken) {
        const { id } = this.encrypter.decrypt(accessToken.token) as Pick<User, 'id'>;
        const account = await this.userRepository.findAccountById(id)
        this.actingAs(account);
    }

    public user(): UserAccount {
        return this.loggedUser;
    }

    // @@TODO: refatorar os testes para usar esse metodo
    public actingAs(user: UserAccount) {
        this.loggedUser = user;
    }
}
