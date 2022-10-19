import { inject, injectable } from "tsyringe";
import { UserModel } from "../../../infra/models/user-model";
import { SignUpDTO } from "../../dto/sign-up";
import { Encrypter } from "../../services/cryptography/encrypter";
import { UserRepository } from "../../services/repositories/user-repository";

@injectable()
export class SignUpUseCase {
    public constructor(
        @inject("UserRepository") private readonly userRepository: UserRepository,
        @inject("Encrypter") private readonly encrypter: Encrypter
    ) { }

    public async execute(data: SignUpDTO): Promise<UserModel> {
        const encryptedPassword = await this.encrypter.encrypt(data.password);
        const { password, password_confirmation, ...output} = await this.userRepository.storeUser({ ...data, password: encryptedPassword });

        return output;
    }
}