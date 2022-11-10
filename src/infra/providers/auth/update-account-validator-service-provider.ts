import { container } from 'tsyringe';
import { ServiceProvider } from '../../../domain/services/provider';
import { CompositeRule } from '../../../domain/services/validation/composite-rule';
import { Validator } from '../../../domain/services/validation/validator';

export class UpdateAccountValidatorServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        container.registerInstance('UpdateAccountValidator', new Validator(
            new CompositeRule([])
        ));
    }
}
