import { AppError } from "../../domain/exceptions/app-error";
import { CompositeRule } from "../../domain/services/validation/composite-rule";
import { Rule } from "../../domain/services/validation/rule";
import { MaxLengthRule } from "./max-length-rule";
import { MinLengthRule } from "./min-length-rule";

export class PasswordValidationRule implements Rule {
    private readonly decoratedRule: CompositeRule;

    public constructor(private readonly fieldName: string) {
        this.decoratedRule = new CompositeRule([
            new MinLengthRule(fieldName, 6),
            new MaxLengthRule(fieldName, 32),
        ]);
    }

    public applyRule(input: any): Error {
        const error = this.decoratedRule.applyRule(input);

        if (error) {
            return error;
        }

        const value = input[this.fieldName];

        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(value)) {
            return new AppError(`Your password must contain at least one digit, one lowercase character, one uppercase character and one special character`);
        }
    }
}