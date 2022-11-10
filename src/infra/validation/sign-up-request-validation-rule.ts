import { CompositeRule } from "./abstractions/composite-rule";
import { Rule } from "../../domain/services/validation/rule";
import { CompareFieldsRule } from "./abstractions/compare-fields-rule";
import { IsEmailRule } from "./abstractions/is-email-rule";
import { PasswordValidationRule } from "./abstractions/password-validation-rule";
import { RequiredFieldRule } from "./abstractions/required-field-rule";

export class SignUpRequestValidationRule implements Rule {
    private readonly rule: Rule;
    
    public constructor() {
        this.rule = new CompositeRule([
            new RequiredFieldRule('email'),
            new IsEmailRule('email'),
            new RequiredFieldRule('name'),
            new RequiredFieldRule('password'),
            new RequiredFieldRule('password_confirmation'),
            new CompareFieldsRule(['password', 'password_confirmation']),
            new PasswordValidationRule('password'),
        ]);
    }

    public applyRule(input: any): Error {
        return this.rule.applyRule(input);
    }
}