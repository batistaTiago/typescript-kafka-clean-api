import { RandomHelper } from "./random-helper";

describe('RandomHelper', () => {
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

    it('should attempt', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
        const sut = new RandomHelper();

        expect(sut.attempt(0.49)).toBe(true);
        expect(sut.attempt(0.50)).toBe(true);
        expect(sut.attempt(0.51)).toBe(true);

        expect(sut.attempt(49)).toBe(true);
        expect(sut.attempt(50)).toBe(true);
        expect(sut.attempt(51)).toBe(false);
    });
});
