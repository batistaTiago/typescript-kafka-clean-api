import { injectable } from "tsyringe";
import { Controller } from "../../services/http/controller";
import { HttpRequest } from "../../services/http/http-request";
import { HttpResponse } from "../../services/http/http-response";
import { HttpStatus } from "../../services/http/status";
import { LoginUseCase } from "../../use-cases/login/login-use-case";

@injectable()
export class LoginController implements Controller {
    public constructor (private readonly useCase: LoginUseCase) { }

    public async handle(request?: HttpRequest): Promise<HttpResponse> {
        return {
            statusCode: HttpStatus.OK,
            body: await this.useCase.execute({ ...request.body })
        };
    }

}