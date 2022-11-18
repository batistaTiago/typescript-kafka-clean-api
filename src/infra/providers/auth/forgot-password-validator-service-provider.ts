import { container } from 'tsyringe';
import { ServiceProvider } from '../../../domain/services/provider';
import { Validator } from '../../../domain/services/validation/validator';
import { ForgotPasswordRequestValidationRule } from '../../validation/forgot-password-request-validation-rule';

export class ForgotPasswordValidatorServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        container.registerInstance('ForgotPasswordValidator', new Validator(new ForgotPasswordRequestValidationRule()));
    }
}
