import { solveStep1, solveStep2, runProgram } from ".";

describe('Day X', () => {
    describe('Step 1', () => {
        // it('works with the example', async () => {
        //     const result = await solveStep1(true);
        //     expect(result).toBe("4,6,3,5,6,3,5,2,1,0");
        // });
        // it('work also with this', async () => {
        //     const result = await runProgram(10, 0, 0, [5,0,5,1,5,4]);
        //     expect(result).toBe("0,1,2");
        // });
        // it('work also with that', async () => {
        //     const result = await runProgram(2024, 0, 0, [0,1,5,4,3,0]);
        //     expect(result).toBe("4,2,5,6,7,7,7,7,3,1,0");
        // });
        it('works with DK\'s input', async () => {  
            const result = await runProgram(27334280, 0, 0, [2,4,1,2,7,5,0,3,1,7,4,1,5,5,3,0]);
            expect(result).toBe("7,6,5,3,6,5,7,0,4");
            // 427098
            // 427102
            // 427098
        });
        // it('provides the right answer', async () => {
        //     const result = await solveStep1(false);
        //     expect(result).toBe(0);
        // });
    });
    describe('Step 2', () => {
        // it('works with the example', async () => {
        //     const result = await solveStep2(true);
        //     expect(result).toBe(0);
        // });
        // it('provides the right answer', async () => {
        //     const result = await solveStep2(false);
        //     expect(result).toBe(0);
        // });
    });
});
