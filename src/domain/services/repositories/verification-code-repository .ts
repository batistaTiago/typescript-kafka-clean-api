import { VerificationCodeModel } from "../../../infra/models/verification-code-model";
import { VerificationCode as VerificationCodeEntitiy } from "../../entities/verification-code";

export interface VerificationCodeRepository {
    storeValidationCode(data: VerificationCodeEntitiy): Promise<VerificationCodeModel>;
}