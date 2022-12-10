import { injectable } from "tsyringe";
import { Authentication } from "../../services/auth/authentication";
import { Controller } from "../../services/http/controller";
import { HttpResponse } from "../../services/http/http-response";
import { HttpStatus } from "../../services/http/status";

@injectable()
export class MyProfileController implements Controller {
    public constructor(private readonly auth: Authentication) { }

    public async handle(): Promise<HttpResponse> {
        return {
            statusCode: HttpStatus.OK,
            body: this.auth.user(),
        };
    }
}
