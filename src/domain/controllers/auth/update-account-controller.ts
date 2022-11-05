import { injectable } from "tsyringe";
import { Authentication } from "../../services/auth/authentication";
import { Controller } from "../../services/http/controller";
import { HttpRequest } from "../../services/http/http-request";
import { HttpResponse } from "../../services/http/http-response";
import { HttpStatus } from "../../services/http/status";
import { UpdateAccountUseCase } from "../../use-cases/sign-up/update-account-use-case";

@injectable()
export class UpdateAccountController implements Controller {
    public constructor (
        private readonly useCase: UpdateAccountUseCase,
        private readonly auth: Authentication
    ) { }

    public async handle(request?: HttpRequest): Promise<HttpResponse> {
        return {
            statusCode: HttpStatus.OK,
            body: await this.useCase.execute({ 
                account: this.auth.user(), 
                fields: { ...request.body } 
            })
        };
    }
}
