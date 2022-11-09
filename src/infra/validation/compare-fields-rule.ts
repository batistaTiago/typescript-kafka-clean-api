import { AppError } from "../../domain/exceptions/app-error";
import { Rule } from "../../domain/services/validation/rule";

export class CompareFieldsRule implements Rule {
    public constructor(private readonly fields: [string, string]) { }

    public applyRule(input: any): Error {
        if (input[this.fields[0]] != input[this.fields[1]]) {
            return new AppError(`Fields ${this.fields[0]} and ${this.fields[1]} do not match`);
        }
    }
}
