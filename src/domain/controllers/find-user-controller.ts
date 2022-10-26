import { inject, injectable } from "tsyringe";
import { Controller } from "../services/http/controller";
import { HttpRequest } from "../services/http/http-request";
import { HttpResponse } from "../services/http/http-response";
import { HttpStatus } from "../services/http/status";
import { UserRepository } from "../services/repositories/user-repository";

@injectable()
export class FindUserController implements Controller {
    public constructor(@inject('UserRepository') private readonly userRepository: UserRepository) { }
    public async handle(request?: HttpRequest): Promise<HttpResponse> {
        const user = await this.userRepository.findById(request.params.id);

        return {
            statusCode: HttpStatus.OK,
            body: user
        }
    }
}