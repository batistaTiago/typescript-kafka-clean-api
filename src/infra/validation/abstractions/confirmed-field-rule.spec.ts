import { AppError } from "../../../domain/exceptions/app-error";
import { ConfirmedFieldRule } from "./confirmed-field-rule";

const invalidParams = [
    {
        field: 'some_value'
    },
    {
        field: 'some_value',
        field_confirmation: null,
    },
    {
        field: 'some_value',
        field_confirmation: undefined,
    },
    {
        field: 'some_value',
        field_confirmation: 'different_value',
    },
    {
        field: 7,
        field_confirmation: 'different_value',
    },
    {
        field: 'some_value',
        field_confirmation: 7,
    },
    {
        field: 'some_value',
        equal_value_but_different_key: 'some_value',
    },
];

const validParams = [
    {
        field: 'some_value',
        field_confirmation: 'some_value',
    },
    {
        field: 'the_same',
        field_confirmation: 'the_same',
    },
    {
        field: 'equal',
        field_confirmation: 'equal',
    },
    {
        field: 'identical',
        field_confirmation: 'identical',
    },
];

describe('ConfirmedField', () => {
    describe.each(invalidParams)('Invalid parameters', (invalidObject) => {
        it('should return an AppError if fields are different from each other', () => {
            const sut = new ConfirmedFieldRule('field');

            const error = sut.applyRule(invalidObject);

            expect(error).toBeDefined();
            expect(error).toBeInstanceOf(AppError);
        });
    });

    describe.each(validParams)('Valid parameters', (validObject) => {
        it('should return undefined if fields are equal', () => {
            const sut = new ConfirmedFieldRule('field');

            const error = sut.applyRule(validObject);

            expect(error).not.toBeDefined();
        });
    });
});
