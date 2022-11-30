import { WithId } from "../dto/with-id";

export interface AccessToken {
    token: string,
    userId: string,
    isRevoked: boolean,
    expiresAt: Date,
}