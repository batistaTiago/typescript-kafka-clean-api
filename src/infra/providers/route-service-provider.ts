import { container } from 'tsyringe';
import { ServiceProvider } from '../../domain/services/provider';
import { createClient } from '@redis/client';
import { promisifyAll } from 'bluebird';
import { ExpressControllerAdapter } from '../http/express/express-controller-adapter';
import { GenerateVerificationCodeControllerExpressAdapter } from '../http/express/controllers/generate-verification-code-controller-express-adapter';
import { HomeControllerExpressAdapter } from '../http/express/controllers/home-controller-express-adapter';

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