import { Request } from 'express';
import { injectable } from 'tsyringe';
import { HomeController } from '../../../../domain/controllers/home-controller';
import { Controller } from '../../../../domain/services/http/controller';
import { ErrorResilientController } from '../../../../domain/services/http/error-resilient-controller';
import { HttpResponse } from '../../../../domain/services/http/http-response';
import { ExpressControllerAdapter } from '../express-controller-adapter';

@injectable()
export class HomeControllerExpressAdapter extends ExpressControllerAdapter {
    private readonly domainController: Controller;

    public constructor(domainController: HomeController) {
        super();
        this.domainController = new ErrorResilientController(domainController);
    }

    public async handleExpressRequest(req: Request): Promise<HttpResponse> {
        return await this.domainController.handle({
            body: req.body,
            ip: req.ip
        });
    }
}