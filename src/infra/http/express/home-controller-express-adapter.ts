import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { HomeController } from '../../../domain/controllers/home-controller';

@injectable()
export class HomeControllerExpressAdapter {
    public constructor(private readonly domainController: HomeController) {}

    public async handle(req: Request, res: Response): Promise<void> {
        const response = await this.domainController.handle({
            body: req.body,
            ip: req.ip
        });

        res.status(response.statusCode).json(response.body);
        return;
    }
}