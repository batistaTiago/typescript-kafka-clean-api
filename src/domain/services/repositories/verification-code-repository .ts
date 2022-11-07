import { VerificationCodeModel } from "../../dto/verification-code-model";
import { User } from "../../entities/user";
import { VerificationCode as VerificationCodeEntitiy } from "../../entities/verification-code";
import { RepositorySearchOptions } from "./repository-search-options";

export interface StoreVerificationCodeRepository {
    storeValidationCode(data: VerificationCodeEntitiy): Promise<VerificationCodeModel>;
}

export interface FindByUserVerificationCodeRepository {
    findByUser(user: User, options?: RepositorySearchOptions): Promise<VerificationCodeEntitiy>;
}

export declare type VerificationCodeRepository = StoreVerificationCodeRepository & FindByUserVerificationCodeRepository;