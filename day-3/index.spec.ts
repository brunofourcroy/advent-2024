import { solveStep1, solveStep2 } from ".";

describe('Day X', () => {
    describe('Step 1', () => {
        it('works with the example', async () => {
            const result = await solveStep1(true);
            expect(result).toBe(161);
        });
        it('provides the right answer', async () => {
            const result = await solveStep1(false);
            expect(result).toBe(153469856);
        });
    });
    describe('Step 2', () => {
        it('works with the example', async () => {
            const result = await solveStep2(true);
            expect(result).toBe(48);
        });
        it('provides the right answer', async () => {
            const result = await solveStep2(false);
            expect(result).toBe(77055967);
        });
    });
});
