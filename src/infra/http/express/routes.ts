import { GenericConstructor } from "../../../utils/generic-constructor-type";
import { FindUserControllerExpressAdapter } from "./controllers/find-user-controller-express-adapter";
import { GenerateVerificationCodeControllerExpressAdapter } from "./controllers/generate-verification-code-controller-express-adapter";
import { HealthCheckControllerExpressAdapter } from "./controllers/health-check-controller-express-adapter";
import { HomeControllerExpressAdapter } from "./controllers/home-controller-express-adapter";
import { SignUpControllerExpressAdapter } from "./controllers/sign-up-controller-express-adapter";
import { ExpressRoute } from "./express-route";

export const Routes: Array<ExpressRoute> = [
    { url: '/', method: 'get', controller: HomeControllerExpressAdapter },
    { url: '/health-check', method: 'get', controller: HealthCheckControllerExpressAdapter },
    { url: '/verification-code', method: 'get', controller: GenerateVerificationCodeControllerExpressAdapter },
    { url: '/auth/sign-up', method: 'post', controller: SignUpControllerExpressAdapter },
    { url: '/users/:id', method: 'get', controller: FindUserControllerExpressAdapter },
];