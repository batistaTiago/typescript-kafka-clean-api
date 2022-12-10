import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { Authentication } from "../../../../domain/services/auth/authentication";

export const auth = () => {
    return (_: Request, __: Response, next: NextFunction) => {
        container.registerInstance(Authentication, new Authentication());
        next();
    }
}
