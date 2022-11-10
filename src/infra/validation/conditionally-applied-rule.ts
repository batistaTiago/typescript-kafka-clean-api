import { Rule } from "../../domain/services/validation/rule";

export class ConditionallyAppliedRule implements Rule {
    public constructor(private readonly decoratedRule: Rule, private readonly condition: (input: any) => boolean) { }

    public applyRule(input: any): Error {
        if (this.condition(input)) {
            return this.decoratedRule.applyRule(input);
        }
    }
}
