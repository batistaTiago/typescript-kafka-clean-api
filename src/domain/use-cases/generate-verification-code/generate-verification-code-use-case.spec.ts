import { GenerateVerificationCodeUseCase } from "./generate-verification-code-use-case";

describe('GenerateVerificationCodeUseCase', () => {
    it('should return 100000 if math call randoms to 0 and no parameter is provided', async () => {
        jest.spyOn(Math, 'random').mockReturnValue(0);
        const sut = new GenerateVerificationCodeUseCase();

        const result = await sut.execute();
        expect(result).toBe(100000);
    });

    it('should return 999999 if math call randoms to 1 and no parameter is provided', async () => {
        jest.spyOn(Math, 'random').mockReturnValue(1);
        const sut = new GenerateVerificationCodeUseCase();

        const result = await sut.execute();
        expect(result).toBe(999999);
    });

    it('should return min parameter if math call randoms to 0 and it exists', async () => {
        jest.spyOn(Math, 'random').mockReturnValue(0);
        const sut = new GenerateVerificationCodeUseCase();
        const expectedResult = 5;

        const result = await sut.execute({ min: expectedResult });

        expect(result).toBe(expectedResult);
    });

    it('should return max parameter if math call randoms to 1 and it exists', async () => {
        jest.spyOn(Math, 'random').mockReturnValue(1);
        const sut = new GenerateVerificationCodeUseCase();
        const expectedResult = 5;

        const result = await sut.execute({ max: expectedResult });

        expect(result).toBe(expectedResult);
    });
});
