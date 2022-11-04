import { injectable } from "tsyringe";
import { Authentication } from "../services/auth/authentication";
import { Controller } from "../services/http/controller";
import { HttpResponse } from "../services/http/http-response";
import { HttpStatus } from "../services/http/status";
import { GenerateVerificationCodeUseCase } from "../use-cases/generate-verification-code/generate-verification-code-use-case";

@injectable()
export class GenerateVerificationCodeController implements Controller {
    public constructor(
        private readonly useCase: GenerateVerificationCodeUseCase,
        private readonly auth: Authentication
    ) {}

    public async handle(): Promise<HttpResponse> {
        const user = this.auth.user();
        const { code, expiresAt } = await this.useCase.execute(user);

        return {
            statusCode: HttpStatus.OK,
            body: { code, expiresAt }
        };
    }
}