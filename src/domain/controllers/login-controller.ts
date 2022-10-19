import { Controller } from "../services/http/controller";
import { HttpRequest } from "../services/http/http-request";
import { HttpResponse } from "../services/http/http-response";

export class LoginController implements Controller {
    
    public async handle(request?: HttpRequest): Promise<HttpResponse> {
        return this.useCase.execute(...request);
    }

}