import { AppError } from "../../../domain/exceptions/app-error";
import { MinLengthRule } from "./min-length-rule";

const invalidParams = [
    '',
    '1',
    '1x',
    '123',
    '12z4',
    '1234d',
    '52b41',
    '5321',
    '6m3',
    '2,7',
];

const validParams = [
    '123456',
    'abcdefg',
    '123defg4',
    'abc123g45x',
    '12561231245',
    'bsa76567as5b',
    'a67bs7861x7621',
];

describe('MinLengthRule', () => {
    const minLength = 6;
    
    describe.each(invalidParams)('Invalid parameters', (invalidString) => {
        it(`should return an AppError if field is ${invalidString.length} characters long`, () => {
            const sut = new MinLengthRule('param', minLength);

            const error = sut.applyRule({ param: invalidString });

            expect(error).toBeDefined();
            expect(error).toBeInstanceOf(AppError);
        });
    });

    describe.each(validParams)('Valid parameters', (validString) => {
        it(`should not return an AppError if field is ${validString.length} characters long`, () => {
            const sut = new MinLengthRule('param', minLength);

            const error = sut.applyRule({ param: validString });

            expect(error).not.toBeDefined();
        });
    });
});
