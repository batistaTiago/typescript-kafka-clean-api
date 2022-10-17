import { Application as Express } from "express";
import { container } from "tsyringe";
import { ExpressApiRoute } from "../infra/http/express/express-api-route";
import { ExpressControllerAdapter } from "../infra/http/express/express-controller-adapter";
import { Application } from "./application";



export class ApiApplication extends Application {
    protected api: Express;

    public constructor() {
        super();

        this.api = require('express')();
        this.api.set('trust proxy', true);
        this.bootApi();
    }

    public async start(): Promise<void> {
        this.api.listen(5000);
    }

    private bootApi() {
        const expressControllers: ExpressControllerAdapter[] = container.resolve("ExpressControllers");
        expressControllers.forEach(route => {
            this.api[route.method](route.url, (req, res) => route.handle(req, res));
        });
    }
}
