import { ServiceProvider } from "../../../domain/services/provider";
import { SignUpValidatorServiceProvider } from "./signup-validator-service-provider";
import { UpdateAccountValidatorServiceProvider } from "./update-account-validator-service-provider";

export class AuthServiceProvider implements ServiceProvider {
    public register(): void {
        (new SignUpValidatorServiceProvider()).register();
        (new UpdateAccountValidatorServiceProvider()).register();
    }
}