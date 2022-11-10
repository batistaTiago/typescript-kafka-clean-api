import { ConditionallyRequiredFieldRule } from "./conditionally-required-field-rule";

const passCondition = jest.fn().mockReturnValue(true);
const failCondition = jest.fn().mockReturnValue(false);

describe('ConditionallyRequiredFieldRule', () => {
    it('should not return an error if the field is empty but the condition is not met', () => {
        const conditionallyRequiredFieldRule = new ConditionallyRequiredFieldRule('some_field', failCondition);
        const error = conditionallyRequiredFieldRule.applyRule({});

        expect(error).toBeUndefined();
    });

    it('should throw an error if the condition passes and the field is empty', () => {
        const conditionallyRequiredFieldRule = new ConditionallyRequiredFieldRule('some_field', passCondition);
        const error = conditionallyRequiredFieldRule.applyRule({});

        expect(error).toBeDefined();
    });

    it('should not throw an error if the condition passes and the field is not empty', () => {
        const conditionallyRequiredFieldRule = new ConditionallyRequiredFieldRule('some_field', passCondition);
        const error = conditionallyRequiredFieldRule.applyRule({ some_field: 'some_value' });

        expect(error).toBeUndefined();
    });
});