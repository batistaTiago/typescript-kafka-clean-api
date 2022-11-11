import { AccessTokenModel } from "../../dto/user/access-token-model";
import { AccessToken } from "../../entities/access-token";

export interface AccessTokenRepository {
    findToken(token: string): Promise<AccessTokenModel>;
    storeToken(params: Partial<AccessToken>): Promise<AccessTokenModel>;
    revokeToken(token: string): Promise<boolean>;
}