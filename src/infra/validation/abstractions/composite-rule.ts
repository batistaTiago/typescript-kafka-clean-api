import { Rule } from "../../../domain/services/validation/rule";

export class CompositeRule implements Rule {
    public constructor (private readonly rules: Array<Rule>) { }

    public applyRule(input: any): Error {
        for (const rule of this.rules) {
            const error = rule.applyRule(input);
            if (error) {
                return error;
            }
        }
    }
}
