import { ConditionallyAppliedRule } from "./conditionally-applied-rule";
import { RequiredFieldRule } from "./required-field-rule";

const passCondition = jest.fn().mockReturnValue(true);
const failCondition = jest.fn().mockReturnValue(false);

describe('ConditionallyAppliedRule', () => {
    it('should not return an error if the field is empty but the condition is not met', () => {
        const conditionallyAppliedRule = new ConditionallyAppliedRule(new RequiredFieldRule('some_field'), failCondition);
        const error = conditionallyAppliedRule.applyRule({});

        expect(error).toBeUndefined();
    });

    it('should throw an error if the condition passes and the field is empty', () => {
        const conditionallyAppliedRule = new ConditionallyAppliedRule(new RequiredFieldRule('some_field'), passCondition);
        const error = conditionallyAppliedRule.applyRule({});

        expect(error).toBeDefined();
    });

    it('should not throw an error if the condition passes and the field is not empty', () => {
        const conditionallyAppliedRule = new ConditionallyAppliedRule(new RequiredFieldRule('some_field'), passCondition);
        const error = conditionallyAppliedRule.applyRule({ some_field: 'some_value' });

        expect(error).toBeUndefined();
    });
});