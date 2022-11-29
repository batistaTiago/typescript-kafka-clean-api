import { CompositeRule } from "./abstractions/composite-rule";
import { Rule } from "../../domain/services/validation/rule";
import { IsEmailRule } from "./abstractions/is-email-rule";
import { RequiredFieldRule } from "./abstractions/required-field-rule";
import { PasswordValidationRule } from "./abstractions/password-validation-rule";
import { ConfirmedFieldRule } from "./abstractions/confirmed-field-rule";

export class PasswordRecoveryRequestValidationRule implements Rule {
    private readonly decoratedRule: Rule;
    
    public constructor() { 
        this.decoratedRule = new CompositeRule([
            new RequiredFieldRule('email'),
            new IsEmailRule('email'),
            new RequiredFieldRule('password'),
            new PasswordValidationRule('password'),
            new ConfirmedFieldRule('password')
        ]);
    }

    public applyRule(input: any): Error {
        return this.decoratedRule.applyRule(input);
    }
}
