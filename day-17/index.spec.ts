import { solveStep1, solveStep2, runProgram } from ".";

describe('Day X', () => {
    describe('Step 1', () => {
        it('works with the example', async () => {
            const result = await solveStep1(true);
            expect(result).toBe("0,3,5,4,3,0");
        });
        it('work also with this', async () => {
            const result = await runProgram(10n, 0n, 0n, [5,0,5,1,5,4]);
            expect(result).toBe("0,1,2");
        });
        it('work also with that', async () => {
            const result = await runProgram(2024n, 0n, 0n, [0,1,5,4,3,0]);
            expect(result).toBe("4,2,5,6,7,7,7,7,3,1,0");
        });
        it('works with DK\'s input', async () => {  
            const result = await runProgram(27334280n, 0n, 0n, [2,4,1,2,7,5,0,3,1,7,4,1,5,5,3,0]);
            expect(result).toBe("7,6,5,3,6,5,7,0,4");
        });
        it('provides the right answer', async () => {
            const result = await solveStep1(false);
            expect(result).toBe("7,1,2,3,2,6,7,2,5");
        });
    });
    describe('Step 2', () => {
        it('provides the same output as the input', async() => {
            const result = await runProgram(117440n, 0n, 0n, [0,3,5,4,3,0]);
            expect(result).toBe("0,3,5,4,3,0");
        });
        it('works with the example', async () => {
            const result = await solveStep2(true);
            expect(result).toBe(117440);
        });
        it('provides the right answer', async () => {
            const result = await solveStep2(false);
            expect(result).toBe(202356708354602);
        });
    });
});
