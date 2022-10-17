import { container } from "tsyringe";
import { Mailable } from "../domain/services/mailing/mailable";
import { Mailer } from "../domain/services/mailing/mailer";
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
        // @@TODO: dinamizar - route service provider injeta um array de rotas nessa classe e esse metodo o varre, registrando as rotas no express
        const homeController = container.resolve(HomeControllerExpressAdapter);
        const verificationController = container.resolve(GenerateVerificationCodeControllerExpressAdapter);
        const method = 'get';

        this.api[method]('/', (req, res) => homeController.handle(req, res));
        this.api[method]('/verification-code', (req, res) => verificationController.handle(req, res));

        this.api[method]('/oi-zekas', async (req, res) => {
            const mailable: Mailable = {
                subject: 'aqui eh o batista',
                message: 'testando integracao com nodemailer'
            };

            const mailer: Mailer = container.resolve('Mailer');
            // await mailer.send(mailable, 'nicholasbalby@hotmail.com');

            return res.json({
                ok: true,
                message: "deu bom"
            });
        });

    }
}
