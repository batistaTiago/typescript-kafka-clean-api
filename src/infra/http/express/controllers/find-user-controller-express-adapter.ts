import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { FindUserController } from '../../../../domain/controllers/find-user-controller';
import { Controller } from '../../../../domain/services/http/controller';
import { ErrorResilientController } from '../../../../domain/services/http/error-resilient-controller';
import { HttpResponse } from '../../../../domain/services/http/http-response';
import { ExpressControllerAdapter } from '../express-controller-adapter';
import { ExpressRoute } from '../express-route';

@injectable()
export class FindUserControllerExpressAdapter extends ExpressControllerAdapter {
    private readonly domainController: Controller;

    public constructor(domainController: FindUserController) {
        super();
        this.domainController = new ErrorResilientController(domainController);
    }

    public route(): ExpressRoute {
        return { method: 'get', url: '/users/:id' };
    }

    public async handleExpressRequest(req: Request): Promise<HttpResponse> {
        return await this.domainController.handle({
            params: req.params
        });
    }
}