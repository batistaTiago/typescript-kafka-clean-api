import { UserModel } from "../../../infra/models/user-model";
import { SignUpDTO, SignUpDTOModel } from "../../dto/sign-up";

export interface UserRepository {
    storeUser(user: SignUpDTO): Promise<SignUpDTOModel>;
    findById(id: string): Promise<UserModel>;
}