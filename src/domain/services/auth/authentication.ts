import { inject, singleton } from "tsyringe";
import { UserModel } from "../../dto/user/user-model";
import { WithId } from "../../dto/with-id";
import { Encrypter } from "../cryptography/encrypter";
import { UserRepository } from "../repositories/user-repository";

@singleton()
export class Authentication {
    private loggedUser?: UserModel;

    public constructor(
        @inject("UserRepository") private readonly userRepository?: UserRepository,
        @inject("Encrypter") private readonly encrypter?: Encrypter
    ) { }

    public async authenticate(token: string) {
        const { id } = this.encrypter.decrypt(token) as WithId;
        this.loggedUser = await this.userRepository.findById(id);
    }

    public user() {
        return this.loggedUser;
    }
}