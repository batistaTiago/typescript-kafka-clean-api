import { container } from 'tsyringe';
import { ServiceProvider } from '../../../domain/services/provider';
import { Validator } from '../../../domain/services/validation/validator';
import { PasswordRecoveryRequestValidationRule } from '../../validation/password-recovery-request-validation-rule';

export class PasswordRecoveryValidatorServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        container.registerInstance('PasswordRecoveryValidator', new Validator(new PasswordRecoveryRequestValidationRule()));
    }
}
