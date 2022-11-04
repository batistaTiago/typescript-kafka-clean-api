import { FindUserControllerExpressAdapter } from "./controllers/find-user-controller-express-adapter";
import { GenerateVerificationCodeControllerExpressAdapter } from "./controllers/generate-verification-code-controller-express-adapter";
import { HealthCheckControllerExpressAdapter } from "./controllers/health-check-controller-express-adapter";
import { HomeControllerExpressAdapter } from "./controllers/home-controller-express-adapter";
import { LoginControllerExpressAdapter } from "./controllers/login-controller-express-adapter";
import { SignUpControllerExpressAdapter } from "./controllers/sign-up-controller-express-adapter";
import { ExpressRoute } from "./express-route";
import { AuthenticateUser } from "./middleware/authenticate-user";

export const Routes: Array<ExpressRoute> = [
    { url: '/', method: 'get', controller: HomeControllerExpressAdapter },
    
    { url: '/auth/sign-up', method: 'post', controller: SignUpControllerExpressAdapter },
    { url: '/auth/login', method: 'post', controller: LoginControllerExpressAdapter },

    { url: '/health-check', method: 'get', controller: HealthCheckControllerExpressAdapter },
    { url: '/verification-code', method: 'get', controller: GenerateVerificationCodeControllerExpressAdapter, middleware: [ AuthenticateUser ] },
    { url: '/users/:id', method: 'get', controller: FindUserControllerExpressAdapter, middleware: [ AuthenticateUser ] },
];
