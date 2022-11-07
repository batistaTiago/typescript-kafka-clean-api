import { UserModel } from "./user-model";
import { SignUpDTO } from "./sign-up";

export interface UpdateAccountDTO extends SignUpDTO {
    current_password: string;
}

export interface UpdateAccountDTOModel extends UpdateAccountDTO, UserModel { }

export interface UserUpdateableFields {
    name?: string;
    password?: string;
}