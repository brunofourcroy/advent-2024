import { readAdventOfCodeFile } from "../utils/readFile";

const getLevelsFromFile = async (isExample: boolean): Promise<number[][]> => {
    const file = await readAdventOfCodeFile(2, isExample);
    const levels = file.split('\n').map(line => line.split(' ').map(Number));
    levels.pop();

    return levels;
};

const isAlwaysIncreasingByLessThan4 = (level: number[]): boolean => level.every((value, index) => {
    if (index === level.length - 1) return true;
    return value < level[index + 1] && level[index + 1] - value < 4;
});

const isAlwaysDecreasingByLessThan4 = (level: number[]): boolean => level.every((value, index) => {
    if (index === level.length - 1) return true;
    return value > level[index + 1] && value - level[index + 1] < 4;
});

const isSafe = (level: number[]): boolean => isAlwaysIncreasingByLessThan4(level) || isAlwaysDecreasingByLessThan4(level);

const isSafeDampened = (level: number[]): boolean => {
    const isSafeAsIs = isSafe(level);
    if (isSafeAsIs) return true;

    for (let i = 0; i < level.length; i++) {
        const newLevel = level.filter((_, index) => index !== i);
        if (isSafe(newLevel)) return true;
    }

    return false;
}

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const levels = await getLevelsFromFile(isExample);
    

    return levels.reduce((acc, level, index) => {
        return acc + (isSafe(level) ? 1 : 0);
    }, 0);
};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const levels = await getLevelsFromFile(isExample);
    

    return levels.reduce((acc, level, index) => {
        return acc + (isSafeDampened(level) ? 1 : 0);
    }, 0);
};
