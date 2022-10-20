import { VerificationCodeModel } from "../../../infra/models/verification-code-model";
import { User } from "../../entities/user";
import { VerificationCode as VerificationCodeEntitiy } from "../../entities/verification-code";

export interface VerificationCodeRepository {
    storeValidationCode(data: VerificationCodeEntitiy): Promise<VerificationCodeModel>;
    findByUser(user: User): Promise<VerificationCodeEntitiy>;
}