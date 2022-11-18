import { User } from "./user";

export interface PasswordRecovery {
    code: string,
    user: User,
    expiresAt: Date,
}
