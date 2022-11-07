import { NextFunction, Request, Response } from "express";
import { autoInjectable, inject } from "tsyringe";
import { Environment } from "../../../../config/environment";
import { Authentication } from "../../../../domain/services/auth/authentication";
import { ExpressMiddleware } from "./express-middleware";

@autoInjectable()
export class AuthenticateUser implements ExpressMiddleware {
    public constructor(private readonly auth?: Authentication) { }

    public async apply(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.header('authorization');
            const token = authHeader.substring('Bearer '.length);
            await this.auth.authenticate(token);
            next();
        } catch (err) {        
            res.status(401).json({
                error: Environment.APP_DEBUG ? (err.message ?? 'Unauthorized') : 'Unauthorized'
            });
        }
    }
}
