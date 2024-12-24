import { solveStep1, solveStep2 } from ".";

describe('Day X', () => {
    describe('Step 1', () => {
        it('works with the example', async () => {
            const result = await solveStep1(true);
            expect(result).toBe(7);
        });
        it('provides the right answer', async () => {
            const result = await solveStep1(false);
            expect(result).toBe(1304);
        });
    });
    describe('Step 2', () => {
        it('works with the example', async () => {
            const result = await solveStep2(true);
            expect(result).toBe('co,de,ka,ta');
        });
        it('provides the right answer', async () => {
            const result = await solveStep2(false);
            expect(result).toBe("ao,es,fe,if,in,io,ky,qq,rd,rn,rv,vc,vl");
        });
    });
});