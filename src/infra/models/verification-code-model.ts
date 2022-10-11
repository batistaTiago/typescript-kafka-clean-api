import { VerificationCode } from "../../domain/entities/verification-code";

export interface VerificationCodeModel extends VerificationCode {
    readonly id: string;
}