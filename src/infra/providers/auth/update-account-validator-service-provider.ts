import { container } from 'tsyringe';
import { ServiceProvider } from '../../../domain/services/provider';
import { Validator } from '../../../domain/services/validation/validator';
import { UpdateAccountRequestValidationRule } from '../../validation/update-account-request-validation-rule';

export class UpdateAccountValidatorServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        container.registerInstance('UpdateAccountValidator', new Validator(new UpdateAccountRequestValidationRule()));
    }
}
