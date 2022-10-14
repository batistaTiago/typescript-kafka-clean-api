import { container } from "tsyringe";
import { GenerateVerificationCodeControllerExpressAdapter } from "../infra/http/express/generate-verification-code-controller-express-adapter";
import { HomeControllerExpressAdapter } from "../infra/http/express/home-controller-express-adapter";
import { Application } from "./application";

export class ApiApplication extends Application {
    // @@TODO: ver como tipar pelo express
    protected api: any;

    public constructor() {
        super();
        
        this.api = require('express')();
        this.api.set('trust proxy', true);
        this.bootApi();      
    }

    public async start(): Promise<void> {
        return this.api.listen(5000);
    }

    private bootApi() {
        // @@TODO: dinamizar...
        const homeController = container.resolve(HomeControllerExpressAdapter);
        const verificationController = container.resolve(GenerateVerificationCodeControllerExpressAdapter);

        this.api.get('/', (req, res) => homeController.handle(req, res));
        this.api.get('/verification-code', (req, res) => verificationController.handle(req, res));
    }
}