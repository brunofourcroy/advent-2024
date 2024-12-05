import { readAdventOfCodeFile } from "../utils/readFile";

type Node = {
    before: number[];
    after: number[];
}

type DepdencencyTree = Record<string, Node>


const parseData = (file: string) => {
    const [rawRules, rawUpdates] = file.split('\n\n');

    const updates: number[][] = rawUpdates.split('\n').map(line => line.split(',').map(Number));
    const rules: DepdencencyTree = {};
    rawRules.split('\n').forEach(line => {
        const [before, after] = line.split('|').map(Number);

        rules[before] = rules[before] || { before: [], after: [] };
        rules[before].after.push(after);

        rules[after] = rules[after] || { before: [], after: [] };
        rules[after].before.push(before);
    });

    return { updates, rules };
}

const isUpdateValid = (update: number[], rules: DepdencencyTree) => {
    return update.every((value, index) => {
        const prev = update[index - 1];
        const prevIsFine = !prev || (!rules[prev]?.before.includes(value));
        const next = update[index + 1];
        const nextIsFine = !next || (!rules[next]?.after.includes(value));

        return prevIsFine && nextIsFine;
    });
}

const getMiddleValue = (update: number[]) => {
    return update[Math.floor(update.length / 2)];
}

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(5, isExample);
    const { updates, rules } = parseData(file);

    
    return updates.reduce((acc, update) => {
        if (isUpdateValid(update, rules)) {
            return acc + getMiddleValue(update);
        }
        return acc;
    }, 0);
};

const fixOrder = (update: number[], rules: DepdencencyTree) => {
    update.sort((a, b) => {
        if (rules[a]?.before.includes(b)) {
            return 1;
        }
        if (rules[b]?.before.includes(a)) {
            return -1;
        }
        return 0;
    });


    return update;
}

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(5, isExample);
    const { updates, rules } = parseData(file);

    
    return updates.reduce((acc, update) => {
        if (!isUpdateValid(update, rules)) {
            const properUpdate = fixOrder([...update], rules);
            return acc + getMiddleValue(properUpdate);
        }
        return acc;
    }, 0);
};
