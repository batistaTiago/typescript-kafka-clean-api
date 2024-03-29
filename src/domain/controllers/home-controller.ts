import { injectable } from "tsyringe";
import { Controller } from "../services/http/controller";
import { HttpRequest } from "../services/http/http-request";
import { HttpResponse } from "../services/http/http-response";
import { HttpStatus } from "../services/http/status";
import { HomeAccessUseCase } from "../use-cases/home-access/home-access-use-case";

@injectable()
export class HomeController implements Controller {
    public constructor(private readonly useCase: HomeAccessUseCase) {}

    public async handle(request: HttpRequest): Promise<HttpResponse> {
        return {
            statusCode: HttpStatus.OK,
            body: await this.useCase.execute({ ip: request.ip })
        };
    }
}
