import { container } from "tsyringe";
import { User } from "../../entities/user";
import { Authentication } from "./authentication";

export class AuthFacade {
    public static user(): User {
        const auth = container.resolve(Authentication);
        return auth.user();
    }
}