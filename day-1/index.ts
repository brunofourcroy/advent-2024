import { readAdventOfCodeFile } from "../utils/readFile";



export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(1, isExample);
    const lines = file.split('\n');
    lines.pop();
    const firstColumn: number[] = [];
    const secondColumn: number[] = [];
    lines.forEach(line => {
        const [first, second] = line.split('   ').map(Number);
        firstColumn.push(first);
        secondColumn.push(second);
    });

    firstColumn.sort((a, b) => a - b);
    secondColumn.sort((a, b) => a - b);
    return firstColumn.reduce((acc, curr, index) => {
        return acc + Math.abs(curr - secondColumn[index]);
    }, 0);
};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(1, isExample);
    const lines = file.split('\n');
    lines.pop();
    const firstColumn: number[] = [];
    const secondColumn: number[] = [];
    lines.forEach(line => {
        const [first, second] = line.split('   ').map(Number);
        firstColumn.push(first);
        secondColumn.push(second);
    });

    return firstColumn.reduce((acc, curr) => {
        return acc + (curr * secondColumn.filter(value => value === curr).length);
    }, 0);
};
