export interface AccessToken {
    token: string,
    isRevoked: boolean,
    expiresAt: Date,
}