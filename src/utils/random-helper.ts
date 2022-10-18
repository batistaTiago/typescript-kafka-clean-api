import { injectable } from "tsyringe";
import { DiceRoller } from "./dicer-roller";
import { RandomNumberGenerator, RandomNumberGeneratorOptions } from "./random-number-generator";

@injectable()
export class RandomHelper implements RandomNumberGenerator, DiceRoller {
    public attempt(chance: number): boolean {
        throw new Error("Method not implemented.");
    }

    public generate(opts: Partial<RandomNumberGeneratorOptions>): number {
        const digits = opts.digits;

        if (digits) { 
            return this.generateFromDigits(digits);
        }

        return this.generateFromMinMax(opts.min, opts.max);
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