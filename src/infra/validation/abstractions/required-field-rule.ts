import { AppError } from "../../../domain/exceptions/app-error";
import { Rule } from "../../../domain/services/validation/rule";

export class RequiredFieldRule implements Rule {
    public constructor(private readonly fieldName: string) { }

    public applyRule(input: any): Error {
        if (!input[this.fieldName]) {
            return new AppError(`Required field was not provided: ${this.fieldName}`);
        }
    }
}
