import { readFile } from "fs/promises";

export const readAdventOfCodeFile = async (day: number, isExample: boolean) => {
    const path = `${__dirname}/../day-${day}/data/data${isExample ? '-example' : ''}.txt`;
    return await readFile(path, 'utf8');
};
