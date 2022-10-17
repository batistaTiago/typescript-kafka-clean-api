import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { GenerateVerificationCodeController } from '../../../domain/controllers/generate-verification-code-controller';
import { Controller } from '../../../domain/services/http/controller';
import { ErrorResilientController } from '../../../domain/services/http/error-resilient-controller';
import { ExpressControllerAdapter } from './express-controller-adapter';

@injectable()
export class GenerateVerificationCodeControllerExpressAdapter implements ExpressControllerAdapter {
    private readonly domainController: Controller;

    public readonly method: string = 'get';
    public readonly url: string = '/verification-code';

    public constructor(domainController: GenerateVerificationCodeController) {
        this.domainController = new ErrorResilientController(domainController);
    }

    public async handle(req: Request, res: Response): Promise<void> {
        const response = await this.domainController.handle();
        res.status(response.statusCode).json(response.body);
    }
}