import { getAntiNodesForAntennas, solveStep1, solveStep2 } from ".";

describe('Day X', () => {
    describe('getAntiNodesForAntennas', () => {
        it('works!', () => {
            expect(getAntiNodesForAntennas([8, 1], [5, 2])).toEqual([[11, 0], [2, 3]]);
            expect(getAntiNodesForAntennas([4, 6], [6, 7])).toEqual([[2, 5], [8, 8]]);
        });
    });
    describe('Step 1', () => {
        it('works with the example', async () => {
            const result = await solveStep1(true);
            expect(result).toBe(14);
        });
        it('provides the right answer', async () => {
            const result = await solveStep1(false);
            expect(result).toBe(313);
        });
    });
    describe('Step 2', () => {
        it('works with the example', async () => {
            const result = await solveStep2(true);
            expect(result).toBe(34);
        });
        it('provides the right answer', async () => {
            const result = await solveStep2(false);
            expect(result).toBe(1064);
        });
    });
});
