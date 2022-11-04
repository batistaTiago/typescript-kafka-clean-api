import { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../../../domain/services/http/http-response";
import { AuthenticateUser } from "./middleware/authenticate-user";
import { ExpressMiddleware } from "./middleware/express-middleware";

export abstract class ExpressControllerAdapter {
    public async handle(req: Request, res: Response): Promise<void> {
        const response = await this.handleExpressRequest(req);
        res.status(response.statusCode).json(response.body);
    }

    protected abstract handleExpressRequest(req: Request): Promise<HttpResponse>;
    
    protected middleware(): Array<ExpressMiddleware> {
        return [
            new AuthenticateUser()
        ];
    }
}