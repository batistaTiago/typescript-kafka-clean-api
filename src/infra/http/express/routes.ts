import { FindUserControllerExpressAdapter } from "./controllers/admin/find-user-controller-express-adapter";
import { GenerateVerificationCodeControllerExpressAdapter } from "./controllers/generate-verification-code-controller-express-adapter";
import { HealthCheckControllerExpressAdapter } from "./controllers/health-check-controller-express-adapter";
import { HomeControllerExpressAdapter } from "./controllers/home-controller-express-adapter";
import { LoginControllerExpressAdapter } from "./controllers/auth/login-controller-express-adapter";
import { ExpressRoute } from "./express-route";
import { AuthenticateUser } from "./middleware/authenticate-user";
import { UpdateAccountControllerExpressAdapter } from "./controllers/auth/update-account-controller-express-adapter";
import { SignUpControllerExpressAdapter } from "./controllers/auth/sign-up-controller-express-adapter";

export const Routes: Array<ExpressRoute> = [
    // Basic
    { url: '/', method: 'get', controller: HomeControllerExpressAdapter },
    { url: '/health-check', method: 'get', controller: HealthCheckControllerExpressAdapter },
    
    // Auth
    { url: '/auth/sign-up', method: 'post', controller: SignUpControllerExpressAdapter },
    { url: '/auth/login', method: 'post', controller: LoginControllerExpressAdapter },
    { url: '/auth/update', method: 'post', controller: UpdateAccountControllerExpressAdapter, middleware: [ AuthenticateUser ] },

    // Domain
    { url: '/verification-code', method: 'get', controller: GenerateVerificationCodeControllerExpressAdapter, middleware: [ AuthenticateUser ] },

    // Adm
    { url: '/users/:id', method: 'get', controller: FindUserControllerExpressAdapter, middleware: [ AuthenticateUser ] },
];
