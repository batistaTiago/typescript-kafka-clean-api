import { Request } from 'express';
import { injectable } from 'tsyringe';
import { GenerateVerificationCodeController } from '../../../../domain/controllers/generate-verification-code-controller';
import { Controller } from '../../../../domain/services/http/controller';
import { ErrorResilientController } from '../../../../domain/services/http/error-resilient-controller';
import { HttpResponse } from '../../../../domain/services/http/http-response';
import { ExpressControllerAdapter } from '../express-controller-adapter';

@injectable()
export class GenerateVerificationCodeControllerExpressAdapter extends ExpressControllerAdapter {
    private readonly domainController: Controller;

    public constructor(domainController: GenerateVerificationCodeController) {
        super();

        this.domainController = new ErrorResilientController(domainController);
    }

    protected async handleExpressRequest(req: Request): Promise<HttpResponse> {
        return await this.domainController.handle();
    }
}