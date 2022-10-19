import { RandomHelper } from "./random-helper";

const diceRollingData = [
    { sides: 2, mockedResult: 0.34, expectedResult: false },
    { sides: 3, mockedResult: 0.34, expectedResult: true },
    { sides: 4, mockedResult: 0.34, expectedResult: true },

    { sides: 2, mockedResult: 0.21, expectedResult: false },
    { sides: 5, mockedResult: 0.21, expectedResult: true },
    { sides: 6, mockedResult: 0.21, expectedResult: true },
    
    { sides: 19, mockedResult: 0.05, expectedResult: false },
    { sides: 20, mockedResult: 0.05, expectedResult: true },
    { sides: 100, mockedResult: 0.05, expectedResult: true },

    { sides: 99, mockedResult: 0.01, expectedResult: false },
    { sides: 100, mockedResult: 0.01, expectedResult: true },
    { sides: 101, mockedResult: 0.01, expectedResult: true },
];

describe('RandomHelper', () => {
    describe('as a RandomNumberGenerator', () => {
        it('should return 100000 if Math.random() call randoms to 0 and no parameter is provided', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0);
    
            const expectedResult = 100000
            const sut = new RandomHelper();
    
            const result = sut.generate({ min: expectedResult });
            expect(result).toBe(expectedResult);
        });
    
        it('should return 999999 if Math.random() call randoms to 1 and no parameter is provided', () => {
            jest.spyOn(Math, 'random').mockReturnValue(1);
    
            const expectedResult = 999999
            const sut = new RandomHelper();
    
            const result = sut.generate({ max: expectedResult });
            expect(result).toBe(expectedResult);
        });
    
        it('should return min parameter if Math.random() call randoms to 0 and it exists', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0);
    
            const expectedResult = 5;
            const sut = new RandomHelper();
    
            const result = sut.generate({ min: expectedResult });
            expect(result).toBe(expectedResult);
        });
    
        it('should return max parameter if Math.random() call randoms to 1 and it exists', () => {
            jest.spyOn(Math, 'random').mockReturnValue(1);
    
            const expectedResult = 9;
            const sut = new RandomHelper();
    
            const result = sut.generate({ max: expectedResult });
            expect(result).toBe(expectedResult);
        });
    
        it('should generate using a number of digits', () => {
            const sut = new RandomHelper();
            const digits = 2;
            const minExpected = 10 ** (digits - 1);
            const maxExpected = (10 ** digits) - 1;
    
            const result = sut.generate({ digits });
    
            expect(result).toBeGreaterThanOrEqual(minExpected);
            expect(result).toBeLessThanOrEqual(maxExpected);
        });
    
        it('should generate number with the number of digits even if Math.random() calls random to zero everytime', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0);
            const sut = new RandomHelper();
    
            for (let digits = 0; digits < 10; digits++) {
                const result = sut.generate({ digits });
                expect(result).toBeLessThanOrEqual(10 ** (digits - 1));
            }
        });
    });

    describe.each(diceRollingData)('as a DiceRoller', (data) => {
        const sut = new RandomHelper();
    
        it(`should roll a ${data.sides}-sided die`, () => {
            jest.spyOn(Math, 'random').mockReturnValue(data.mockedResult);
            expect(sut.roll(data.sides)).toBe(data.expectedResult);
            expect(sut.roll(data.sides)).toBe(data.expectedResult);
            expect(sut.roll(data.sides)).toBe(data.expectedResult);
        });
    });
});
