import { Controller } from "./controller";
import { HttpRequest } from "./http-request";
import { HttpResponse } from "./http-response";

export class ErrorResilientController implements Controller {
    public constructor(protected readonly controller: Controller) {}

    public async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            return await this.controller.handle(request);
        } catch (error) {
            return {
                statusCode: 500,
                body: {
                    error: error.message
                }
            }
        }
    }
}
