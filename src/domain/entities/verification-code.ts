import { User } from "./user";

export interface VerificationCode {
    code: string;
    expiresAt?: Date;
    user: Omit<User, 'password'>;
}