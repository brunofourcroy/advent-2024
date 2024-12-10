import { readAdventOfCodeFile } from "../utils/readFile";


const replaceCharAt = (str: string, pos: number, char: string) => {
    return str.substring(0, pos) + char + str.substring(pos +1);
}


const unpackString = (str: string): string[] => {
    let res: string[] = [];
    
    let fileId = 0;
    let isFile = true;

    for (let i = 0; i < str.length; i++) {
        const cur = Number(str[i]);
        for (let j = 0; j < cur; j++) {
            if (isFile) {
                res.push(fileId.toString());
            } else {
                res.push('.');
            }
        }
        if (isFile) {
            fileId++;
        }
        isFile = !isFile;
    }

    return res;
};

const toCheckSum = (str: string[]): number => {
    let res = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '.') {
            continue;
        }
        res += Number(str[i]) * i;
    }
    return res;
};

const compressString = (str: string[]): string[] => {

    let lastFree = 0;
    for (let i = str.length -1; i >= 0; i--) {
        if (str[i] === '.') {
            continue;
        }
        lastFree = str.findIndex(c => c === '.');
        if (lastFree === -1 || lastFree > i) {
            break;
        }
        str[lastFree] = str[i];
        str[i] = '.';
    }

    return str;
};

const findIndexFrom = (arr: string[], char: string, from: number): number => arr.findIndex((c, i) => c === char && i > from);

const compressStringV2 = (str: string[]): string[] => {
    for (let i = str.length -1; i >= 0; i--) {
        let lastFree = 0;
        if (str[i] === '.') {
            continue;
        }
        const curValue = str[i];
        let fileSize = 1;
        for (let j = i - 1; j >= 0; j--) {
            if (str[j] !== curValue) {
                break;
            }
            fileSize++;
        }
        while (true) {
            lastFree = findIndexFrom(str, '.', lastFree);
            if (lastFree === -1 || lastFree > i) {
                break;
            }
    
            let canFit = true;
            for (let j = lastFree; j < lastFree + fileSize; j++) {
                if (str[j] !== '.') {
                    canFit = false;
                    break;
                }
            }
            if (canFit) {
                for (let j = 0; j < fileSize; j++) {
                    str[lastFree + j] = curValue;
                    str[i - j] = '.';
                }
                break;
            }
        }
        i -= fileSize - 1;
    }

    return str;
};

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(9, isExample);
    const unpacked = unpackString(file);
    const compressed = compressString(unpacked);

    return toCheckSum(compressed);
};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(9, isExample);
    const unpacked = unpackString(file);
    const compressed = compressStringV2(unpacked);

    return toCheckSum(compressed);
};
