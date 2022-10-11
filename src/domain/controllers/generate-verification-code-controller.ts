import { injectable } from "tsyringe";
import { Controller } from "../services/http/controller";
import { HttpResponse } from "../services/http/http-response";
import { HttpStatus } from "../services/http/status";
import { GenerateVerificationCodeUseCase } from "../use-cases/generate-verification-code/generate-verification-code-use-case";

@injectable()
export class GenerateVerificationCodeController implements Controller {
    public constructor(private readonly useCase: GenerateVerificationCodeUseCase) {}

    public async handle(): Promise<HttpResponse> {
        const result = await this.useCase.execute()
        const { code, expiresAt } = result
        return {
            statusCode: HttpStatus.OK,
            body: { code, expiresAt }
        };
    }

}