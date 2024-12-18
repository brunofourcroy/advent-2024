import { solveStep1, solveStep2 } from ".";

describe('Day X', () => {
    describe('Step 1', () => {
        it('works with the example', async () => {
            const result = await solveStep1(true, 7, 7, 12);
            expect(result).toBe(22);
        });
        it('provides the right answer', async () => {
            const result = await solveStep1(false, 71, 71, 1024);
            expect(result).toBe(294);
        });
    });
    describe('Step 2', () => {
        it('works with the example', async () => {
            const result = await solveStep2(true, 7, 7);
            expect(result).toBe('6,1');
        });
        it('provides the right answer', async () => {
            const result = await solveStep2(false, 71, 71);
            expect(result).toBe('31,22');
        });
    });
});
