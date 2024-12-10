import { solveStep1, solveStep2 } from ".";

describe('Day X', () => {
    describe('Step 1', () => {
        it('works with the example', async () => {
            const result = await solveStep1(true);
            expect(result).toBe(36);
        });
        it('provides the right answer', async () => {
            const result = await solveStep1(false);
            expect(result).toBe(617);
        });
    });
    describe('Step 2', () => {
        it('works with the example', async () => {
            const result = await solveStep2(true);
            expect(result).toBe(81);
        });
        it('provides the right answer', async () => {
            const result = await solveStep2(false);
            expect(result).toBe(1477);
        });
    });
});
