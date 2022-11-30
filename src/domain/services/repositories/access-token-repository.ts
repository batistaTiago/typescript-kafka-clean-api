import { AccessTokenModel } from "../../dto/user/access-token-model";
import { AccessToken } from "../../entities/access-token";
import { User } from "../../entities/user";

export interface AccessTokenRepository {
    findToken(token: string): Promise<AccessTokenModel>;
    // @@TODO: relembrar pq esse partial
    storeToken(params: Partial<AccessToken>): Promise<AccessTokenModel>;
    revokeToken(token: string): Promise<boolean>;
    revokeAllFromUser(user: User): Promise<void>;
}