import { solveStep1, solveStep2 } from ".";

describe('Day 4', () => {
    describe('Step 1', () => {
        it('works with the example', async () => {
            const result = await solveStep1(true);
            expect(result).toBe(18);
        });
        it('provides the right answer', async () => {
            const result = await solveStep1(false);
            expect(result).toBe(2618);
        });
    });
    describe('Step 2', () => {
        it('works with the example', async () => {
            const result = await solveStep2(true);
            expect(result).toBe(9);
        });
        it('provides the right answer', async () => {
            const result = await solveStep2(false);
            expect(result).toBe(0);
        });
    });
});
