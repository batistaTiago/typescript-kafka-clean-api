import { ObjectHelper } from "./object-helper"

const removeEmptySampleData = [
    {
        recursive: true,
        entry: {},
        expectedResult: {}
    },
    {
        recursive: true,
        entry: {
            field: 'with-data',
        },
        expectedResult: { 
            field: 'with-data' 
        }
    },
    {
        recursive: true,
        entry: {
            field: 'with-data',
            empty: null,
            notDefined: undefined
        },
        expectedResult: { 
            field: 'with-data' 
        }
    },
    {
        recursive: true,
        entry: {
            field: 'with-data',
            nested: {
                anotherField: 'with-data',
                empty: null,
                notDefined: undefined,
            }
        },
        expectedResult: {
            field: 'with-data',
            nested: {
                anotherField: 'with-data',
            }
        }
    },
    {
        recursive: true,
        entry: {
            field: 'with-data',
            nested: {
                anotherField: 'with-data',
                empty: null,
                notDefined: undefined,
                deep: {
                    yetAnotherField: 'with-data',
                    somethingEmpty: null,
                    reallyDeep: {
                        field: 'value',
                        empty: null,
                    }
                }
            }
        },
        expectedResult: {
            field: 'with-data',
            nested: {
                anotherField: 'with-data',
                deep: {
                    yetAnotherField: 'with-data',
                    reallyDeep: {
                        field: 'value',
                    }
                }
            }
        }
    },
    {
        recursive: true,
        entry: {
            onlyNested: {
                anotherField: 'with-data',
                empty: null,
                notDefined: undefined,
            }
        },
        expectedResult: {
            onlyNested: {
                anotherField: 'with-data',
            }
        }
    },
    {
        recursive: false,
        entry: {
            field: 'with-data',
            nested: {
                anotherField: 'with-data',
                empty: null,
                notDefined: undefined,
            }
        },
        expectedResult: {
            field: 'with-data',
            nested: {
                anotherField: 'with-data',
                empty: null,
                notDefined: undefined,
            }
        }
    },
];

const isObjectSampleData = [
    {
        descriptor: 'an empty object',
        input: {},
        expectation: true,
    },
    {
        descriptor: 'null',
        input: null,
        expectation: false,
    },
    {
        descriptor: 'undefined',
        input: undefined,
        expectation: false,
    },
    {
        descriptor: 'an empty array',
        input: [],
        expectation: false,
    },
    {
        descriptor: 'an arbitrary object',
        input: { field: 'value' },
        expectation: true,
    },
    {
        descriptor: 'an empty string',
        input: '',
        expectation: false,
    },
    {
        descriptor: 'a non-empty string',
        input: 'some string',
        expectation: false,
    },
    {
        descriptor: 'a non-empty array',
        input: [{}],
        expectation: false,
    },
    {
        descriptor: 'a non-empty object',
        input: { a: [] },
        expectation: true,
    },
    {
        descriptor: 'a function',
        input: () => {},
        expectation: false,
    },
];

const swapKeysSampleData = [
    {
        input: { a: 'b' },
        from: 'a',
        to: 'b',
        expectation: { b: 'b' }
    },
    {
        input: { b: 'a' },
        from: 'b',
        to: 'a',
        expectation: { a: 'a' }
    },
    {
        input: { b: 'a', c: 'unchanged' },
        from: 'b',
        to: 'a',
        expectation: { a: 'a', c: 'unchanged' }
    }
];

describe('ObjectHelper', () => {
    describe.each(removeEmptySampleData)('removeEmpty', ({ recursive, entry, expectedResult }) => {
        it('should remove null or undefined values in an object', () => {
            const sut = new ObjectHelper();

            const output = sut.removeEmpty(entry, recursive);

            expect(output).toEqual(expectedResult);
        });

        it('should not alter the original object', () => {
            const sut = new ObjectHelper();
            const oldEntryJson = JSON.stringify(entry);

            const output = sut.removeEmpty(entry, recursive);

            expect(output).toEqual(expectedResult);
            expect(JSON.stringify(entry)).toEqual(oldEntryJson);
        });
    });

    describe.each(isObjectSampleData)('isObject', ({ descriptor, input, expectation }) => {
        it(`should evaluate ${descriptor} types into ${expectation}`, () => {
            const sut = new ObjectHelper();
            expect(sut.isObject(input)).toBe(expectation);
        });
    });

    describe.each(swapKeysSampleData)('swapKeys', ({ input, from, to, expectation }) => {
        it(`should swap keys`, () => {
            const sut = new ObjectHelper();
            expect(sut.swapKeys(input, from, to)).toEqual(expectation);
        });
    });
});