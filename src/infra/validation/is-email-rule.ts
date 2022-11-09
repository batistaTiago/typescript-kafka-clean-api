import { AppError } from "../../domain/exceptions/app-error";
import { Rule } from "../../domain/services/validation/rule";

export class IsEmailRule implements Rule {
    public constructor(private readonly fieldName: string) { }

    public applyRule(input: string): Error {
        // console.log(`validating: ${input[this.fieldName]}`);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input[this.fieldName])) {
            return new AppError(`Invalid email: ${input[this.fieldName]}`);
        }
    }
}
