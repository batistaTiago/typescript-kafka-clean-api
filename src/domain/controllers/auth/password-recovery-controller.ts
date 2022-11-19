import { inject, injectable } from "tsyringe";
import { Controller } from "../../services/http/controller";
import { HttpRequest } from "../../services/http/http-request";
import { HttpResponse } from "../../services/http/http-response";
import { HttpStatus } from "../../services/http/status";
import { Validator } from "../../services/validation/validator";
import { PasswordRecoveryUseCase } from "../../use-cases/sign-up/password-recovery-use-case";
import { UseCase } from "../../use-cases/use-case";

@injectable()
export class PasswordRecoveryController implements Controller {
    public constructor (
        @inject('PasswordRecoveryUseCase') private readonly useCase: UseCase,
        @inject('PasswordRecoveryValidator') private readonly validator: Validator,
    ) { }

    public async handle(request?: HttpRequest): Promise<HttpResponse> {
        this.validator.validate(request.body);
        const result = await this.useCase.execute({ ...request.body });

        return {
            statusCode: HttpStatus.OK,
            body: result
        };
    }
}
