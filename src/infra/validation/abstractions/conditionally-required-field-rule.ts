import { Rule } from "../../../domain/services/validation/rule";
import { ConditionallyAppliedRule } from "./conditionally-applied-rule";
import { RequiredFieldRule } from "./required-field-rule";

export class ConditionallyRequiredFieldRule extends ConditionallyAppliedRule implements Rule {
    public constructor(fieldName: string, condition: (input: any) => boolean) {
        super(new RequiredFieldRule(fieldName), condition);
    }
}
