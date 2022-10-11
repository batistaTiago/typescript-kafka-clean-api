import { Controller } from "../services/http/controller";
import { HttpRequest } from "../services/http/http-request";
import { HttpResponse } from "../services/http/http-response";
import { HttpStatus } from "../services/http/status";
import { GenerateVerificationCodeUseCase } from "../use-cases/generate-verification-code/generate-verification-code-use-case";

export class GenerateVerificationCodeController implements Controller {
    public constructor(private readonly useCase: GenerateVerificationCodeUseCase) {}

    public async handle(request: HttpRequest): Promise<HttpResponse> {
        return {
            statusCode: HttpStatus.OK,
            body: this.useCase.execute()
        };
    }

}