import { CompositeRule } from "../../domain/services/validation/composite-rule";
import { Rule } from "../../domain/services/validation/rule";
import { CompareFieldsRule } from "./compare-fields-rule";
import { IsEmailRule } from "./is-email-rule";
import { PasswordValidationRule } from "./password-validation-rule";
import { RequiredFieldRule } from "./required-field-rule";

export class SignUpRequestValidationRule implements Rule {
    private readonly rule: Rule;
    
    public constructor() {
        this.rule = new CompositeRule([
            new RequiredFieldRule('email'),
            new IsEmailRule('email'),
            new RequiredFieldRule('name'),
            new RequiredFieldRule('email'),
            new RequiredFieldRule('password'),
            new PasswordValidationRule('password'),
            new RequiredFieldRule('password_confirmation'),
            new CompareFieldsRule(['password', 'password_confirmation']),
        ])
    }

    public applyRule(input: any): Error {
        return this.rule.applyRule(input);
    }
}