import { injectable } from "tsyringe";
import { Controller } from "../services/http/controller";
import { HttpRequest } from "../services/http/http-request";
import { HttpResponse } from "../services/http/http-response";
import { HttpStatus } from "../services/http/status";
import { SignUpUseCase } from "../use-cases/sign-up/sign-up-use-case";

@injectable()
export class SignUpController implements Controller {
    private readonly requiredFields: string[];

    public constructor(private readonly useCase: SignUpUseCase) {
        this.requiredFields = ['email', 'name', 'password', 'password_confirmation'];
    }
    
    public async handle(request?: HttpRequest): Promise<HttpResponse> {
        this.requiredFields.forEach(field => {
            if (!request.body[field]) {
                throw new Error(`Missing param: ${field}`);
            }
        });

        if (!this.emailIsValid(request.body.email)) {
            throw new Error(`Invalid param: email`);
        }

        if (request.body.password !== request.body.password_confirmation) {
            throw new Error('Passwords do not match');
        }

        return {
            statusCode: HttpStatus.OK,
            body: await this.useCase.execute({
                ...request.body,
                registrationDate: new Date()
            })
        }
    }

    private emailIsValid(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}