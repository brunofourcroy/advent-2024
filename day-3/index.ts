import { readAdventOfCodeFile } from "../utils/readFile";



export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(3, isExample);
    const matches = file.match(/mul\(([\d]+,[\d]+)\)/g) ?? [];
    return matches?.map(match => 
        (match.match(/\(([\d, ]+)\)/)?.[1] ?? '')
        .split(',')
        .map(Number)
        .reduce((acc: number, value: number) => acc * value , 1)
    ).reduce((acc: number, value: number) => acc + value, 0) ?? 0;
};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(3, isExample);
    const matches = file.match(/(mul\(([\d]+,[\d]+)\))|(do\(\))|(don't\(\))/g) ?? [];
    let enabled = true;

    return (matches ?? []).reduce((acc: number, match) => {
        console.log(match);
        if (match === 'do()') {
            enabled = true;
        } else if (match === "don't()") {
            enabled = false;
        } else if (match.startsWith('mul') && enabled) {
            const mul = match.match(/\(([\d, ]+)\)/)?.[1]
                .split(',')
                .map(Number)
                .reduce((acc: number, value: number) => acc * value , 1) ?? 0;
            return acc + mul;
        }
        return acc;
    }, 0);
};
