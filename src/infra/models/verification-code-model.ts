import { VerificationCode } from "../../domain/entities/verification-code";

export interface VerificationCodeModel extends VerificationCode {
    id: string;
}