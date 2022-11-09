import { inject, injectable } from "tsyringe";
import { Controller } from "../../services/http/controller";
import { HttpRequest } from "../../services/http/http-request";
import { HttpResponse } from "../../services/http/http-response";
import { HttpStatus } from "../../services/http/status";
import { SignUpUseCase } from "../../use-cases/sign-up/sign-up-use-case";
import { Validator } from "../../services/validation/validator";

@injectable()
export class SignUpController implements Controller {
    public constructor(
        private readonly useCase: SignUpUseCase,
        @inject('SignUpValidator') private readonly validator: Validator
    ) {
    }
    
    public async handle(request?: HttpRequest): Promise<HttpResponse> {
        this.validator.validate(request.body);

        return {
            statusCode: HttpStatus.OK,
            body: await this.useCase.execute({
                ...request.body,
                registrationDate: new Date()
            })
        }
    }
}
