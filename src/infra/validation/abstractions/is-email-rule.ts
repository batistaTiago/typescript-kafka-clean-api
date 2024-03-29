import { AppError } from "../../../domain/exceptions/app-error";
import { Rule } from "../../../domain/services/validation/rule";

export class IsEmailRule implements Rule {
    public constructor(private readonly field: string) { }

    public applyRule(input: any): Error {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input[this.field])) {
            return new AppError(`Invalid email: ${input[this.field]}`);
        }
    }
}
