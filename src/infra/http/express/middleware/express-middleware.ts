import { NextFunction, Request, Response } from "express";

export interface ExpressMiddleware {
    handle(req: Request, res: Response, next: NextFunction): Promise<any>;
}