import { Rule } from "./rule";

export class CompositeRule implements Rule {
    public constructor (private readonly rules: Array<Rule>) { }

    public applyRule(input: any): Error {
        for (const rule of this.rules) {
        // console.log(`applying rule: ${rule.constructor.name}`);
        const error = rule.applyRule(input);
            if (error) {
                // console.log(`Error in field ${(rule as any).fieldName}: ${error.message}`);
                return error;
            }
        }
    }    
}