import { readAdventOfCodeFile } from "../utils/readFile";

const parseFile = (file: string): { results: number[], values: number[][] } => {
    const lines = file.split('\n');
    lines.pop();

    return lines.reduce((acc: { results: number[], values: number[][] }, line) => {
        const [result, rest] = line.split(': ');
        const values = rest.split(' ').map(Number);
        
        return {
            results: [...acc.results, Number(result)],
            values: [...acc.values, values]
        };
    }, { results: [], values: [] });
}

export const isValidResult = (result: number, values: number[], includConcatenation = false): boolean => {
    // We're only increasing the values, so if we're already higher, we'll never get there.
    if (values[0] > result) {
        return false;
    }
    
    if (values.length === 1) {
        return values[0] === result;
    }

    if (!includConcatenation) {
        return isValidResult(result, [values[0] + values[1], ...values.slice(2)]) || isValidResult(result, [values[0] * values[1], ...values.slice(2)]);
    }

    return isValidResult(result, [values[0] + values[1], ...values.slice(2)], true) || 
        isValidResult(result, [values[0] * values[1], ...values.slice(2)], true) ||
        isValidResult(result, [Number(`${values[0]}${values[1]}`), ...values.slice(2)], true);
}

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(7, isExample);
    const { results, values } = parseFile(file);
    const validResults = results.filter((result, index) => isValidResult(result, values[index]));

    return validResults.reduce((acc, result) => acc + result, 0);
};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(7, isExample);
    const { results, values } = parseFile(file);
    const validResults = results.filter((result, index) => isValidResult(result, values[index], true));

    return validResults.reduce((acc, result) => acc + result, 0);
};
