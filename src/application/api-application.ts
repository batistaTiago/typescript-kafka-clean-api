import { Application as Express, json } from "express";
import { container } from "tsyringe";
import { Environment } from "../config/environment";
import { Mailable } from "../domain/services/mailing/mailable";
import { Mailer } from "../domain/services/mailing/mailer";
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
        this.api.listen(Environment.API_PORT);
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

        this.api.get('/fire-email', async (req, res) => {
            const mailable: Mailable = {
                subject: 'aqui eh o batista',
                message: 'testando integracao com nodemailer'
            };

            const mailer: Mailer = container.resolve('Mailer');
            await mailer.send(mailable, 'nicholasbalby@hotmail.com');

            return res.json({
                ok: true,
                message: "deu bom"
            });
        });
    }
}
