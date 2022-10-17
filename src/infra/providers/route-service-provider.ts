import { container } from 'tsyringe';
import { Environment } from '../../config/environment';
import { ServiceProvider } from '../../domain/services/provider';
import { createClient } from '@redis/client';
import { promisifyAll } from 'bluebird';
import { HomeControllerExpressAdapter } from '../http/express/home-controller-express-adapter';
import { GenerateVerificationCodeControllerExpressAdapter } from '../http/express/generate-verification-code-controller-express-adapter';
import { ExpressControllerAdapter } from '../http/express/express-controller-adapter';

promisifyAll(createClient);

export class RouteServiceProvider implements ServiceProvider {
    public register(): void {
        const controllers: ExpressControllerAdapter[] = [
            container.resolve(HomeControllerExpressAdapter),
            container.resolve(GenerateVerificationCodeControllerExpressAdapter),
        ];

        container.register<ExpressControllerAdapter[]>("ExpressControllers", { useValue: controllers });
    }
}