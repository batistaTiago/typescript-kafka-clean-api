import { VerificationCode } from "../entities/verification-code";
import { WithId } from "./with-id";

export interface VerificationCodeModel extends VerificationCode, WithId { }