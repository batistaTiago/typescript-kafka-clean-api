import { NextFunction, Request, Response } from "express";

export interface ExpressMiddleware {
    apply(req: Request, res: Response, next: NextFunction): Promise<any>;
}