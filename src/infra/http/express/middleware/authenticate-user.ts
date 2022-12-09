import { NextFunction, Request, Response } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";
import { Environment } from "../../../../config/environment";
import { AccessToken } from "../../../../domain/entities/access-token";
import { AppError } from "../../../../domain/exceptions/app-error";
import { Authentication } from "../../../../domain/services/auth/authentication";
import { HttpStatus } from "../../../../domain/services/http/status";
import { AccessTokenRepository } from "../../../../domain/services/repositories/access-token-repository";
import { ExpressMiddleware } from "./express-middleware";

@injectable()
export class AuthenticateUser implements ExpressMiddleware {
    public constructor(
        private readonly auth: Authentication,
        @inject('AccessTokenRepository') private readonly tokenRepository?: AccessTokenRepository
    ) { }

    public async apply(req: Request, res: Response, next: NextFunction) {
        try {
            // @@TODO: validar se esse if resolve o bug do actingAs nos tests...
            if (!this.auth.user()) {
                const authHeader = req.header('authorization');
                const tokenString = authHeader.substring('Bearer '.length);
                const tokenRecord = await this.tokenRepository.findToken(tokenString);
                await this.auth.authenticate(this.validated(tokenRecord));
            }
            next();
        } catch (err) {        
            res.status(HttpStatus.UNAUTHORIZED).json({
                error: Environment.APP_DEBUG ? (err.message ?? 'Unauthorized') : 'Unauthorized'
            });
        }
    }

    private validated(token: AccessToken): AccessToken {
        if (token.isRevoked || this.tokenisExpired(token)) {
            throw new AppError('Your session has expired, please login again');
        }

        return token;
    }

    private tokenisExpired(token: AccessToken): boolean {
        const now = new Date();
        const expiresAt = token.expiresAt;

        return expiresAt < now;
    }
}
