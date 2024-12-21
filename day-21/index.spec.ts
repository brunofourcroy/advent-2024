import { getInputForFinalOutput, solveStep1, solveStep2 } from ".";

describe('Day X', () => {
    describe('Step 1', () => {
        describe('getInput', () => {
            it('returns the correct input', () => {
                const input = ['0', '2', '9', 'A'];
                const expectedInputLength = '<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A'.length;
    
                const result = getInputForFinalOutput(input, 2);
                expect(result.length).toBe(expectedInputLength);
            });
            it('returns the correct input', () => {
                const input = ['9', '8', '0', 'A'];
                const expectedInputLength = '<v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A'.length;
    
                const result = getInputForFinalOutput(input, 2);
                expect(result.length).toBe(expectedInputLength);
            });
            it('returns the correct input', () => {
                const input = ['1', '7', '9', 'A'];
                const expectedInputLength = '<v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A'.length;
    
                const result = getInputForFinalOutput(input, 2);
                expect(result.length).toBe(expectedInputLength);
            });
            it('returns the correct input', () => {
                const input = ['4', '5', '6', 'A'];
                const expectedInputLength = '<v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A'.length;
    
                const result = getInputForFinalOutput(input, 2);
                expect(result.length).toBe(expectedInputLength);
            });
            it('returns the correct input', () => {
                const input = ['3', '7', '9', 'A'];
                const expectedInputLength = '<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A'.length;
    
                const result = getInputForFinalOutput(input, 2);
                expect(result.length).toBe(expectedInputLength);
            });
        });
        it('works with the example', async () => {
            const result = await solveStep1(true);
            expect(result).toBe(126384);
        });
        it('provides the right answer', async () => {
            const result = await solveStep1(false);
            expect(result).toBe(176870);
        });
    });
    describe('Step 2', () => {
        // it('works with the example', async () => {
        //     const result = await solveStep2(true);
        //     expect(result).toBe(0);
        // });
        it('provides the right answer', async () => {
            const result = await solveStep2(false);
            expect(result).toBe(0);
        });
    });
});
