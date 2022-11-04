import { NextFunction, Request, Response } from "express";
import { autoInjectable, inject } from "tsyringe";
import { WithId } from "../../../../domain/dto/with-id";
import { Authentication } from "../../../../domain/services/auth/authentication";
import { ExpressMiddleware } from "./express-middleware";

@autoInjectable()
export class AuthenticateUser implements ExpressMiddleware {
    public constructor(private readonly auth?: Authentication) { }

    public async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.header('authorization');
            const token = authHeader.substring('Bearer '.length);
            await this.auth.authenticate(token);
            next();
        } catch (err) {        
            res.status(401).json({
                error: 'Unauthenticated'
            })
        }
    }
}
