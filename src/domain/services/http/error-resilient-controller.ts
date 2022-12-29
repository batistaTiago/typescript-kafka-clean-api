import { autoInjectable } from "tsyringe";
import { Environment } from "../../../config/environment";
import { ObjectHelper } from "../../../utils/object-helper";
import { AppError } from "../../exceptions/app-error";
import { ErrorHandler } from "../../exceptions/handler";
import { Controller } from "./controller";
import { HttpRequest } from "./http-request";
import { HttpResponse } from "./http-response";
import { HttpStatus } from "./status";

@autoInjectable()
export class ErrorResilientController implements Controller {
    public constructor(
        protected readonly controller: Controller,
        private readonly objectHelper?: ObjectHelper,
        private readonly errorHandler?: ErrorHandler,
    ) {}

    public async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            return await this.controller.handle(request);
        } catch (error) {
            // @@TODO: definir se o erro pode ser enviado para o client ou nao
            console.error(error);
            return this.parseError(error);
        }
    }

    private parseError(error: Error): HttpResponse {
        const isAppError = error instanceof AppError;
        const output = this.objectHelper.removeEmpty({
            statusCode: isAppError ? HttpStatus.BAD_REQUEST : HttpStatus.SERVER_ERROR,
            body: {
                error: isAppError ? error.message : 'Unexpected server error, please try again later',
                details: Environment.APP_DEBUG ? (error.stack ?? "Error stack not found") : null
            }
        }) as HttpResponse;

        console.log(output);
        return output;
    }
}
