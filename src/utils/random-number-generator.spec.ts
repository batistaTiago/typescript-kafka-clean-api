import { RandomNumberGenerator } from "./random-number-generator";

describe('RandomNumberGenerator', () => {
    it('should return 100000 if math call randoms to 0 and no parameter is provided', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0);

        const expectedResult = 100000
        const sut = new RandomNumberGenerator();

        const result = sut.generate({ min: expectedResult });
        expect(result).toBe(expectedResult);
    });

    it('should return 999999 if math call randoms to 1 and no parameter is provided', () => {
        jest.spyOn(Math, 'random').mockReturnValue(1);

        const expectedResult = 999999
        const sut = new RandomNumberGenerator();

        const result = sut.generate({ max: expectedResult });
        expect(result).toBe(expectedResult);
    });

    it('should return min parameter if math call randoms to 0 and it exists', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0);

        const expectedResult = 5;
        const sut = new RandomNumberGenerator();

        const result = sut.generate({ min: expectedResult });
        expect(result).toBe(expectedResult);
    });

    it('should return max parameter if math call randoms to 1 and it exists', () => {
        jest.spyOn(Math, 'random').mockReturnValue(1);

        const expectedResult = 9;
        const sut = new RandomNumberGenerator();

        const result = sut.generate({ max: expectedResult });
        expect(result).toBe(expectedResult);
    });

    it('should generate using a number of digits', () => {
        const sut = new RandomNumberGenerator();
        const digits = 2;
        const minExpected = 10 ** (digits - 1);
        const maxExpected = (10 ** digits) - 1;

        const result = sut.generate({ digits });

        expect(result).toBeGreaterThanOrEqual(minExpected);
        expect(result).toBeLessThanOrEqual(maxExpected);
        expect(String(result)).not.toContain('0');
    });
});