import { UserModel } from "../../dto/user-model";
import { SignUpDTO, SignUpDTOModel } from "../../dto/sign-up";

export interface StoreUserRepository {
    storeUser(user: SignUpDTO): Promise<SignUpDTOModel>;
}

export interface FindByIdUserRepository {
    findById(id: string): Promise<UserModel>;
}

export interface FindByEmailUserRepository {
    findByEmail(email: string): Promise<UserModel>;
}


export declare type UserRepository = StoreUserRepository & FindByIdUserRepository & FindByEmailUserRepository;
// export interface UserRepository extends StoreUserRepository, FindByIdUserRepository, FindByEmailUserRepository {}