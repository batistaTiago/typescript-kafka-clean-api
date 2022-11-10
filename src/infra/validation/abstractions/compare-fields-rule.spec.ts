import { AppError } from "../../../domain/exceptions/app-error";
import { CompareFieldsRule } from "./compare-fields-rule";

const invalidParams = [
    {
        some_field: 'some_value',
        some_other_field: 'different_value',
    },
    {
        some_field: 'some_value',
        some_other_field: 5,
    },
    {
        some_field: 5,
        some_other_field: [],
    },
    {
        some_field: [],
        some_other_field: ['some_string'],
    },
];

const validParams = [
    {
        some_field: 'some_value',
        some_other_field: 'some_value',
    },
    {
        some_field: 5,
        some_other_field: 5,
    },
    {
        some_field: null,
        some_other_field: null,
    },
    {
        some_field: undefined,
        some_other_field: undefined,
    },
];

describe('CompareFieldsRule', () => {
    describe.each(invalidParams)('Invalid parameters', (invalidObject) => {
        it('should return an AppError if fields are different from each other', () => {
            const fields = Object.keys(invalidObject);
            const sut = new CompareFieldsRule(fields as [string, string]);

            const error = sut.applyRule(invalidObject);

            expect(error).toBeDefined();
            expect(error).toBeInstanceOf(AppError);
        });
    });

    describe.each(validParams)('Valid parameters', (validObject) => {
        it('should return undefined if fields are equal', () => {
            const fields = Object.keys(validObject);
            const sut = new CompareFieldsRule(fields as [string, string]);

            const error = sut.applyRule(validObject);

            expect(error).not.toBeDefined();
        });
    });
});
