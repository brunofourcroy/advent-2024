import { solveStep1, solveStep2 } from ".";

describe('Day X', () => {
    describe('Step 1', () => {
        it('works with the example', async () => {
            const result = await solveStep1(true);
            expect(result).toBe(2024);
        });
        it('provides the right answer', async () => {
            const result = await solveStep1(false);
            expect(result).toBe(48063513640678);
        });
    });
    describe('Step 2', () => {
        // it('works with the example', async () => {
        //     const result = await solveStep2(true);
        //     expect(result).toBe(0);
        // });
        it('provides the right answer', async () => {
            const result = await solveStep2(false);
            expect(result).toBe("hqh,mmk,pvb,qdq,vkq,z11,z24,z38");
        });
    });
});
