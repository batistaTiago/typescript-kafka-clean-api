export interface Rule {
    applyRule(input: any): Error;
}