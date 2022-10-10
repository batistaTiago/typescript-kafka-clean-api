import { injectable } from "tsyringe";
import { Controller } from "../services/http/controller";
import { HttpRequest } from "../services/http/http-request";
import { HttpResponse } from "../services/http/http-response";
import { HomeAccessUseCase } from "../use-cases/home-access-use-case";

@injectable()
export class HomeController implements Controller {
    public constructor(private readonly useCase: HomeAccessUseCase) {}

    public async handle(request: HttpRequest): Promise<HttpResponse> {
        const body = await this.useCase.execute({ ip: request.ip });
        
        return {
            statusCode: 200,
            body
        };
    }

}