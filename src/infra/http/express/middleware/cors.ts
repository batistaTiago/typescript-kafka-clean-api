import { NextFunction, Request, Response } from "express";

export const cors = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        res.set('access-control-allow-origin', '*');
        res.set('access-control-allow-methods', '*');
        res.set('access-control-allow-headers', '*');
        next();
    }
}