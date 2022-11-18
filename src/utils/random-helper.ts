import { injectable } from "tsyringe";
import { DiceRoller } from "../domain/services/randomizer/dicer-roller";
import { RandomNumberGenerator, RandomNumberGeneratorOptions } from "../domain/services/randomizer/random-number-generator";

@injectable()
export class RandomHelper implements RandomNumberGenerator, DiceRoller {
    public pick(from: string) {
        return from[this.generate({ min: 0, max: (from.length - 1) })];
    }

    public roll(sides: number): boolean {
        this.validateSidesParameter(sides);
        return this.attempt(100.0 / sides);
    }

    public generate({ min, max, digits }: Partial<RandomNumberGeneratorOptions>): number {
        return digits ? this.generateFromDigits(digits) : this.generateFromMinMax(min, max);
    }

    private generateFromMinMax(min: number = 0, max: number = 9): number {
        return Math.floor((Math.random() * (max - min))) + min;
    }

    private generateFromDigits(digits: number): number {
        return this.generateFromMinMax(10 ** (digits - 1), (10 ** digits) - 1);
    }

    private attempt(chance: number): boolean {
        const result = (Math.random() * 100);
        return result >= chance; 
    }

    private validateSidesParameter(sides: number): void {
        if ((sides < 1) || (Math.floor(sides) != Math.ceil(sides))) {
            throw new Error('Argument must be an integer greater than or equal to 1');
        }
    }
}
