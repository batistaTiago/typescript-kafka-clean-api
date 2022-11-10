import { container } from 'tsyringe';
import { ServiceProvider } from '../../../domain/services/provider';
import { CompositeRule } from '../../../domain/services/validation/composite-rule';
import { Validator } from '../../../domain/services/validation/validator';
import { CompareFieldsRule } from '../../validation/compare-fields-rule';
import { IsEmailRule } from '../../validation/is-email-rule';
import { PasswordValidationRule } from '../../validation/password-validation-rule';
import { RequiredFieldRule } from '../../validation/required-field-rule';

export class SignUpValidatorServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        container.registerInstance('SignUpValidator', new Validator(
            new CompositeRule([
                new RequiredFieldRule('email'),
                new IsEmailRule('email'),
                new RequiredFieldRule('name'),
                new RequiredFieldRule('email'),
                new RequiredFieldRule('password'),
                new PasswordValidationRule('password'),
                new RequiredFieldRule('password_confirmation'),
                new CompareFieldsRule(['password', 'password_confirmation']),
            ])
        ));
    }
}
