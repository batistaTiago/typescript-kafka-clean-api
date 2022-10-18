import { injectable } from "tsyringe";
import { DiceRoller } from "./dicer-roller";
import { RandomNumberGenerator, RandomNumberGeneratorOptions } from "./random-number-generator";

@injectable()
export class RandomHelper implements RandomNumberGenerator, DiceRoller {
    public attempt(chance: number): boolean {
        return Math.random() < (chance < 1 ? (chance * 100) : chance);
    }

    public generate({ min, max, digits }: Partial<RandomNumberGeneratorOptions>): number {
        return digits ? this.generateFromDigits(digits) : this.generateFromMinMax(min, max);
    }

    private generateFromMinMax(min: number = 0, max: number = 9): number {
        return Math.floor((Math.random() * (max - min))) + min;
    }

    private generateFromDigits(digits: number): number {
        return Array.from(Array(digits).keys())
            .map((_, index, arr) => {
                const exponent = 10 ** index;
                const isLasElement = index === (arr.length - 1);
                return exponent * this.generateFromMinMax(isLasElement ? 1 : 0, 9)
            })
            .reduce((previous, current) => previous + current);
    }
}
