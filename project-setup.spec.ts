class Example {
    public getTrue(): boolean {
        return true;
    }
}

describe('project config', () => {
    it('should be working properly', () => {
        const example = new Example();
        expect(example).toBeInstanceOf(Example);
        expect(example.getTrue()).toBe(true);
    })
})