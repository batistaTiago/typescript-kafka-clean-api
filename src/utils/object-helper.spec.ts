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
        input: {},
        expectation: true,
    },
    {
        input: null,
        expectation: false,
    },
    {
        input: undefined,
        expectation: false,
    },
    {
        input: [],
        expectation: false,
    },
    {
        input: { field: 'value' },
        expectation: true,
    },
    {
        input: '',
        expectation: false,
    },
    {
        input: 'absease',
        expectation: false,
    },
    {
        input: [{}],
        expectation: false,
    },
    {
        input: { a: []},
        expectation: true,
    },
    {
        input: () => {},
        expectation: false,
    },
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

    describe.each(isObjectSampleData)('isObject', ({ input, expectation }) => {
        it('should return check various types', () => {
            const sut = new ObjectHelper();
            expect(sut.isObject(input)).toBe(expectation);
        });
    });
});