import { Application as Express, json } from "express";
import { container } from "tsyringe";
import { Environment } from "../config/environment";
import { contentType } from "../infra/http/express/middleware/content-type";
import { cors } from "../infra/http/express/middleware/cors";
import { Application } from "./application";
import { Routes as routes } from '../infra/http/express/routes';
import { ExpressRoute } from "../infra/http/express/express-route";

export class ApiApplication extends Application {
    protected api: Express;

    public constructor() {
        super();

        this.api = require('express')();
        this.api.set('trust proxy', true);
        
        this.registerMiddleware();
        this.initRoutes();
    }

    public async start(): Promise<void> {
        this.api.listen(Environment.API_PORT);
    }

    private registerMiddleware(): void {
        this.api.use(json());
        this.api.use(cors());
        this.api.use(contentType());
    }

    private initRoutes() {
        routes.forEach((route: ExpressRoute) => {
            this.api[route.method](route.url, (req, res) => container.resolve(route.controller).handle(req, res));
        });
    }
}
