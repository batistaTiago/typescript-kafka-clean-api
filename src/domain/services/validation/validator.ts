import { Rule } from "./rule";

export class Validator {
    public constructor(private readonly rule: Rule) { }

    public validate(input: any): void {
        const error = this.rule.applyRule(input);
        if (error) {
            throw error;
        }
    }
}