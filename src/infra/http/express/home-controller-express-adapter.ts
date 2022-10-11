import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { HomeController } from '../../../domain/controllers/home-controller';
import { Controller } from '../../../domain/services/http/controller';
import { ErrorResilientController } from '../../../domain/services/http/error-resilient-controller';

@injectable()
export class HomeControllerExpressAdapter {
    private readonly domainController: Controller;

    public constructor(domainController: HomeController) {
        this.domainController = new ErrorResilientController(domainController);
    }

    public async handle(req: Request, res: Response): Promise<void> {
        const response = await this.domainController.handle({
            body: req.body,
            ip: req.ip
        });

        res.status(response.statusCode).json(response.body);
    }
}