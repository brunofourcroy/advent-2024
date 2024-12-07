import { solveStep1, solveStep2 } from ".";

describe('Day X', () => {
    describe('Step 1', () => {
        it('works with the example', async () => {
            const result = await solveStep1(true);
            expect(result).toBe(3749);
        });
        it('provides the right answer', async () => {
            const result = await solveStep1(false);
            expect(result).toBe(1399219271639);
        });
    });
    describe('Step 2', () => {
        it('works with the example', async () => {
            const result = await solveStep2(true);
            expect(result).toBe(11387);
        });
        it('provides the right answer', async () => {
            const result = await solveStep2(false);
            expect(result).toBe(275791737999003);
        });
    });
});
