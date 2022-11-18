import { CompositeRule } from "./abstractions/composite-rule";
import { Rule } from "../../domain/services/validation/rule";
import { IsEmailRule } from "./abstractions/is-email-rule";
import { RequiredFieldRule } from "./abstractions/required-field-rule";

export class ForgotPasswordRequestValidationRule implements Rule {
    private readonly decoratedRule: Rule;
    
    public constructor() { 
        this.decoratedRule = new CompositeRule([
            new RequiredFieldRule('email'),
            new IsEmailRule('email'),
        ]);
    }

    public applyRule(input: any): Error {
        return this.decoratedRule.applyRule(input);
    }
}
