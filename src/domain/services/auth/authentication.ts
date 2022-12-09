import { autoInjectable, inject } from "tsyringe";
import { User } from "../../../infra/database/mysql/entities/user.entity";
import { UserModel } from "../../dto/user/user-model";
import { AccessToken } from "../../entities/access-token";
import { Encrypter } from "../cryptography/encrypter";
import { UserRepository } from "../repositories/user-repository";

@autoInjectable()
export class Authentication {
    private loggedUser?: UserModel;

    public constructor(
        @inject("UserRepository") private readonly userRepository?: UserRepository,
        @inject("Encrypter") private readonly encrypter?: Encrypter
    ) { }

    public async authenticate(accessToken: AccessToken) {
        const { id } = this.encrypter.decrypt(accessToken.token) as Pick<User, 'id'>;
        const account = await this.userRepository.findAccountById(id);
        this.actingAs(account);
    }

    public user(): UserModel {
        return this.loggedUser;
    }

    // @@TODO: refatorar os testes para usar esse metodo
    public actingAs(user: UserModel) {
        this.loggedUser = user;
    }
}
