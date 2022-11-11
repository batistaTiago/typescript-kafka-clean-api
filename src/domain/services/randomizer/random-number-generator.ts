export interface DigitsGenerationOptions {
    digits: number;
}
export interface MinMaxGenerationOptions {
    min: number;
    max: number;
}

export interface RandomNumberGeneratorOptions extends MinMaxGenerationOptions, DigitsGenerationOptions {}

export interface RandomNumberGenerator {
    generate(options: Partial<RandomNumberGeneratorOptions>): number;
}
