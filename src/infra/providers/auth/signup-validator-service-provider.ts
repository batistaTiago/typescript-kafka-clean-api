import { container } from 'tsyringe';
import { ServiceProvider } from '../../../domain/services/provider';
import { Validator } from '../../../domain/services/validation/validator';
import { SignUpRequestValidationRule } from '../../validation/sign-up-request-validation-rule';

export class SignUpValidatorServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        container.registerInstance('SignUpValidator', new Validator(new SignUpRequestValidationRule()));
    }
}
