import { readAdventOfCodeFile } from "../utils/readFile";

const getStonesAsArray = (file: string): number[] => {
    return file.split(' ').map(Number);
};

const splitStone = (stone: number): [number, number] => {
    const halves = stone.toString().split('').map(Number);
    const firstHalf = halves.slice(0, halves.length / 2).join('');
    const secondHalf = halves.slice(halves.length / 2).join('');
    return [Number(firstHalf), Number(secondHalf)];
}

const blinkLikeABrute = (stones: number[]): number[] => {
    const newStones = [];

    for (const stone of stones) {
        if (stone === 0) {
            newStones.push(1);
        } else if (stone.toString().length % 2 === 0) {
            const halves = splitStone(stone);
            newStones.push(halves[0]);
            newStones.push(halves[1]);
        } else {
            newStones.push(stone * 2024);
        }
    }

    return newStones;
};

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(11, isExample);
    let stones = getStonesAsArray(file);

    const NUMBER_OF_BLINKS = 25;

    for (let i = 0; i < NUMBER_OF_BLINKS; i++) {
        stones = blinkLikeABrute(stones);
    }

    return stones.length;
};

const getStonesAsMap = (file: string): Map<number, number> => {
    const stones = getStonesAsArray(file);
    const map = new Map<number, number>();

    for (const stone of stones) {
        map.set(stone, (map.get(stone) || 0) + 1);
    }

    return map;
}


const blinkLikeAGentleman = (stones: Map<number, number>): Map<number, number> => {
    const newStones = new Map<number, number>();

    for (const [value, count] of stones) {
        if (value === 0) {
            newStones.set(1, (newStones.get(1) ?? 0) + count);
        } else if (value.toString().length % 2 === 0) {
            const halves = splitStone(value);
            newStones.set(halves[0], (newStones.get(halves[0]) ?? 0) + count);
            newStones.set(halves[1], (newStones.get(halves[1]) ?? 0) + count);
        } else {
            newStones.set(value * 2024, (newStones.get(value * 2024) ?? 0) + count);
        }
    }

    return newStones;
};

const toCount = (stones: Map<number, number>): number => {
    return Array.from(stones.values()).reduce((acc, curr) => acc + curr, 0);
};

export const solveStep2 = async (isExample: boolean, blinks: number): Promise<number> => {
    const file = await readAdventOfCodeFile(11, isExample);
    let stones = getStonesAsMap(file);

    for (let i = 0; i < blinks; i++) {
        stones = blinkLikeAGentleman(stones);
    }

    return toCount(stones);
};
