export interface DiceRoller {
    attempt(chance: number): boolean;
}