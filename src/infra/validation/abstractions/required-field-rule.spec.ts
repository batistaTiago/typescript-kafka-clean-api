import { AppError } from "../../../domain/exceptions/app-error";
import { RequiredFieldRule } from "./required-field-rule";

const invalidParams = [
    {
        required_param: undefined,
    },
    {
        required_param: null,
    },
    {
        required_param: '',
    },
];

const validParams = [
    {
        required_param: 'some_value',
    },
    {
        required_param: 5,
    },
    {
        required_param: { some: 'object' },
    },
    {
        required_param: [{ some: 'object' }],
    },
];

describe('RequiredFieldRule', () => {
    describe.each(invalidParams)('Invalid parameters', (invalidObject) => {
        it('should return an AppError if field is invalid', () => {
            const sut = new RequiredFieldRule('required_param');

            const error = sut.applyRule(invalidObject);

            expect(error).toBeDefined();
            expect(error).toBeInstanceOf(AppError);
        });
    });

    describe.each(validParams)('Valid parameters', (validObject) => {
        it('should not return an AppError if field is valid', () => {
            const sut = new RequiredFieldRule('required_param');

            const error = sut.applyRule(validObject);

            expect(error).not.toBeDefined();
        });
    });
});
