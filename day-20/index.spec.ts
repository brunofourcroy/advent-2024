import { solveStep1, solveStep2 } from ".";

describe('Day X', () => {
    describe('Step 1', () => {
        it('works with the example', async () => {
            const result = await solveStep1(true, 0);
            expect(result).toBe(44);
        });
        it('provides the right answer', async () => {
            const result = await solveStep1(false, 100);
            expect(result).toBe(1521);
        });
    });
    describe('Step 2', () => {
        it('works with the example', async () => {
            const result = await solveStep2(true, 50);
            expect(result).toBe(285);
        });
        // it('provides the right answer', async () => {
        //     const result = await solveStep2(false);
        //     expect(result).toBe(0);
        // });
    });
});
