import { solveStep1, solveStep2 } from ".";

describe('Day X', () => {
    describe('Step 1', () => {
        it('works with the example', async () => {
            const result = await solveStep1(true);
            expect(result).toBe(55312);
        });
        it('provides the right answer', async () => {
            const result = await solveStep1(false);
            expect(result).toBe(203953);
        });
    });
    describe('Step 2', () => {
        it('works with the example - 6 blinks', async () => {
            const result = await solveStep2(true, 6);
            expect(result).toBe(22);
        });
        it('works with the example - 25 blinks', async () => {
            const result = await solveStep2(true, 25);
            expect(result).toBe(55312);
        });
        it('provides the right answer', async () => {
            const result = await solveStep2(false, 75);
            expect(result).toBe(242090118578155);
        });
    });
});
