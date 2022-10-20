import { Controller } from "./controller";
import { HttpRequest } from "./http-request";
import { HttpResponse } from "./http-response";
import { HttpStatus } from "./status";

export class ErrorResilientController implements Controller {
    public constructor(protected readonly controller: Controller) {}

    public async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            return await this.controller.handle(request);
        } catch (error) {
            // @@TODO: definir se o erro pode ser enviado para o client ou nao
            console.error(error);
            return {
                statusCode: HttpStatus.SERVER_ERROR,
                body: {
                    error: error.message
                }
            }
        }
    }
}
