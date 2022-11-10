import { Document } from "mongodb";
import { AppError } from "../../domain/exceptions/app-error";
import { Rule } from "../../domain/services/validation/rule";

export class MinLengthRule implements Rule {
    public constructor(private readonly fieldName: string, private readonly minLength: number) { }

    public applyRule(input: any): Error {
        const value = input[this.fieldName];

        if (typeof value !== 'string') {
            return new Error(`Invalid argument, propery ${this.fieldName} must be a string`);
        }

        if (value.length < this.minLength) {
            return new AppError(`Field ${this.fieldName} must be a string with at least ${this.minLength} characters`);
        }
    }
}