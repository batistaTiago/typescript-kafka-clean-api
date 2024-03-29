import { CompositeRule } from "./abstractions/composite-rule";
import { Rule } from "../../domain/services/validation/rule";
import { ConditionallyAppliedRule } from "./abstractions/conditionally-applied-rule";
import { IsEmailRule } from "./abstractions/is-email-rule";
import { PasswordValidationRule } from "./abstractions/password-validation-rule";
import { RequiredFieldRule } from "./abstractions/required-field-rule";

export class UpdateAccountRequestValidationRule implements Rule {
    private readonly decoratedRule: Rule;
    
    public constructor() { 
        this.decoratedRule = new CompositeRule([
            new ConditionallyAppliedRule(new IsEmailRule('email'), (input) => this.inputHasKey(input, 'email')),
            new ConditionallyAppliedRule(new RequiredFieldRule('current_password'), (input) => this.inputHasKey(input, 'password')),
            new ConditionallyAppliedRule(new RequiredFieldRule('password_confirmation'), (input) => this.inputHasKey(input, 'password')),
            new ConditionallyAppliedRule(new PasswordValidationRule('password'), (input) => this.inputHasKey(input, 'password')),
        ]);
    }

    public applyRule(input: any): Error {
        return this.decoratedRule.applyRule(input);
    }

    private inputHasKey(input: any, key: string): boolean {
        return !!(input[key]);
    }
}
