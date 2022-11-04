import { Request } from 'express';
import { inject, injectable } from 'tsyringe';
import { LoginController } from '../../../../domain/controllers/login-controller';
import { Controller } from '../../../../domain/services/http/controller';
import { ErrorResilientController } from '../../../../domain/services/http/error-resilient-controller';
import { HttpResponse } from '../../../../domain/services/http/http-response';
import { ExpressControllerAdapter } from '../express-controller-adapter';

@injectable()
export class LoginControllerExpressAdapter extends ExpressControllerAdapter {
    private readonly domainController: Controller;

    public constructor(@inject(LoginController) domainController: Controller) {
        super();
        this.domainController = new ErrorResilientController(domainController);
    }

    public async handleExpressRequest(req: Request): Promise<HttpResponse> {
        return await this.domainController.handle({
            body: req.body
        });
    }
}