import { AppError } from "../../../domain/exceptions/app-error";
import { Rule } from "../../../domain/services/validation/rule";

export class ConfirmedFieldRule implements Rule {
    public constructor(private readonly field: string) { }

    public applyRule(input: any): Error {
        const confirmationField = `${this.field}_confirmation`;
        if (input[this.field] != input[confirmationField]) {
            return new AppError(`Fields ${this.field} and ${confirmationField} do not match`);
        }
    }
}
