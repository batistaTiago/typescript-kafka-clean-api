import { Request, Response } from "express";

export interface ExpressControllerAdapter {
    handle(req: Request, res: Response): Promise<void>;
    method: string;
    url: string;
}