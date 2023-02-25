import createApi, { Application as Express, json, NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { Environment } from "../config/environment";
import { contentType } from "../infra/http/express/middleware/content-type";
import { cors } from "../infra/http/express/middleware/cors";
import { Application } from "./application";
import { Routes as routes } from '../infra/http/express/routes';
import { ExpressRoute } from "../infra/http/express/express-route";
import { GenericConstructor } from "../utils/generic-constructor-type";
import { ExpressMiddleware } from "../infra/http/express/middleware/express-middleware";
import { auth } from "../infra/http/express/middleware/auth";
import { KafkaMessageProducerAdapter } from "../infra/messaging/kafka/producer/kafka-message-producer-adapter";
import { Events } from "../domain/enums/events";
import { Message } from "../domain/services/messaging/message";
import { Event } from "../domain/entities/event";

export class ApiApplication extends Application {
    protected api: Express;

    public constructor() {
        super();

        this.api = createApi();
        this.api.set('trust proxy', true);
        
        this.registerMiddleware();
        this.initRoutes();
    }

    public async start(): Promise<void> {
        this.api.listen(Environment.API_PORT);

        const event: Message<Event> = {
            body: {
                eventName: Events.SERVER_RESTART,
                happenedAt: new Date(),
                data: {
                    port: Environment.API_PORT
                }
            },
        };
        
        const producer = container.resolve(KafkaMessageProducerAdapter);
        await producer.connect();
        await producer.publish('events', event);
    }

    private registerMiddleware(): void {
        this.api.use(auth());
        this.api.use(json());
        this.api.use(cors());
        this.api.use(contentType());
    }

    private initRoutes() {
        routes.forEach((route: ExpressRoute) => {
            route.middleware?.forEach((Middleware: GenericConstructor<ExpressMiddleware>) => {
                this.api.use(route.url, (req: Request, res: Response, next: NextFunction) => {
                    container.resolve(Middleware).apply(req, res, next);
                });
            });

            this.api[route.method](route.url, (req: Request, res: Response) => container.resolve(route.controller).handle(req, res));
        });
    }
}
