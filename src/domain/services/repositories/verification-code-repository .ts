import { VerificationCodeModel } from "../../dto/verification-code-model";
import { User } from "../../entities/user";
import { VerificationCode as VerificationCodeEntitiy } from "../../entities/verification-code";

export interface StoreVerificationCodeRepository {
    storeValidationCode(data: VerificationCodeEntitiy): Promise<VerificationCodeModel>;
}

export interface FindByUserVerificationCodeRepository {
    findByUser(user: User): Promise<VerificationCodeEntitiy>;
}

export declare type VerificationCodeRepository = StoreVerificationCodeRepository & FindByUserVerificationCodeRepository;