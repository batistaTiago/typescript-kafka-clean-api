import { ServiceProvider } from "../../../domain/services/provider";
import { ForgotPasswordValidatorServiceProvider } from "./forgot-password-validator-service-provider";
import { PasswordRecoveryValidatorServiceProvider } from "./password-recovery-validator-service-provider";
import { SignUpValidatorServiceProvider } from "./signup-validator-service-provider";
import { UpdateAccountValidatorServiceProvider } from "./update-account-validator-service-provider";

export class AuthServiceProvider implements ServiceProvider {
    public register(): void {
        (new SignUpValidatorServiceProvider()).register();
        (new UpdateAccountValidatorServiceProvider()).register();
        (new ForgotPasswordValidatorServiceProvider()).register();
        (new PasswordRecoveryValidatorServiceProvider()).register();
    }
}