import { Application as Express } from "express";
import { container } from "tsyringe";
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
        expressControllers.forEach(controller => {
            this.api[controller.route().method](controller.route().url, (req, res) => controller.handle(req, res));
        });
    }
}
