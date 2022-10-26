import { Request } from 'express';
import { injectable } from 'tsyringe';
import { SignUpController } from '../../../../domain/controllers/sign-up-controller';
import { Controller } from '../../../../domain/services/http/controller';
import { ErrorResilientController } from '../../../../domain/services/http/error-resilient-controller';
import { HttpResponse } from '../../../../domain/services/http/http-response';
import { ExpressControllerAdapter } from '../express-controller-adapter';
import { ExpressRoute } from '../express-route';

@injectable()
export class SignUpControllerExpressAdapter extends ExpressControllerAdapter {
    private readonly domainController: Controller;

    public constructor(domainController: SignUpController) {
        super();
        this.domainController = new ErrorResilientController(domainController);
    }

    public route(): ExpressRoute {
        return { method: 'post', url: '/auth/sign-up' };
    }

    public async handleExpressRequest(req: Request): Promise<HttpResponse> {
        return await this.domainController.handle({
            body: req.body
        });
    }
}