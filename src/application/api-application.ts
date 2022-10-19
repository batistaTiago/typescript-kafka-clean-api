import { Application as Express, json } from "express";
import { container } from "tsyringe";
import { ExpressControllerAdapter } from "../infra/http/express/express-controller-adapter";
import { contentType } from "../infra/http/express/middleware/content-type";
import { cors } from "../infra/http/express/middleware/cors";
import { Application } from "./application";

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
        this.api.listen(5000);
    }

    private registerMiddleware(): void {
        this.api.use(json());
        this.api.use(cors());
        this.api.use(contentType());
    }

    private initRoutes() {
        const expressControllers: ExpressControllerAdapter[] = container.resolve("ExpressControllers");
        expressControllers.forEach(controller => {
            this.api[controller.route().method](controller.route().url, (req, res) => controller.handle(req, res));
        });
    }
}
