import { injectable } from "tsyringe";

interface RandomNumberGeneratorOptions {
    min?: number;
    max?: number;
    digits?: number;
}

@injectable()
export class RandomNumberGenerator {
    public generate({ min, max, digits }: RandomNumberGeneratorOptions = {}): number {
        if (digits) { 
            return this.generateFromDigits(digits);
        }

        return this.generateFromMinMax(min, max);
    }

    private generateFromMinMax(min: number = 0, max: number = 9): number {
        const diff = max - min;
        return Math.floor((Math.random() * diff)) + min;
    }

    private generateFromDigits(digits: number): number {
        let output = 0;

        for (let i = 0; i < digits; i++) {
            const decimal = 10 ** i;
            output += decimal * this.generateFromMinMax(1, 9);
        }

        return output;
    }
}