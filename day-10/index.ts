import { readAdventOfCodeFile } from "../utils/readFile";


type Grid = number[][];

const getGrid = (file: string): Grid => {
    return file.split("\n").map((line) => line.split("").map(Number));
};

const isWithinBounds = (x: number, y: number, grid: Grid): boolean => {
    return x >= 0 && y >= 0 && x < grid[0].length && y < grid.length;
};

const getValidNeighbours = (start: { x: number, y: number }, grid: Grid): { x: number, y: number }[] => {
    const val = grid[start.y][start.x];

    const neighbours = [
        { x: start.x - 1, y: start.y },
        { x: start.x + 1, y: start.y },
        { x: start.x, y: start.y - 1 },
        { x: start.x, y: start.y + 1 }
    ];

    return neighbours.filter(({ x, y }) => isWithinBounds(x, y, grid) && grid[y][x] === val + 1);
};

const dedupe = (summits: { x: number, y: number }[]): Set<string> => summits.reduce((acc, { x, y }) => {
    acc.add(`${x},${y}`);
    return acc;
}, new Set<string>());

const goUp = (start: { x: number, y: number }, grid: Grid): { x: number, y: number }[] => {
    const val = grid[start.y][start.x];

    if (val === 9) {
        return [{ x: start.x, y: start.y }];
    }

    const validNeighbours = getValidNeighbours(start, grid);
    
    return validNeighbours.reduce((total: { x: number, y: number }[], neighbour) => {
        const paths = goUp(neighbour, grid);
        total.push(...paths)
        return total;
    }, []);
};


const getScore = (start: { x: number, y: number }, grid: Grid, shouldDedupe: boolean): number => {
    const val = grid[start.y][start.x];

    if (val === 9) {
        return 1;
    }

    const summits = goUp(start, grid);

    if (shouldDedupe) {
        const uniqueSummits = dedupe(summits);
        return uniqueSummits.size;
    }

    return summits.length;
};

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(10, isExample);
    const grid = getGrid(file);

    const startingPoints: { x: number, y: number }[] = grid
        .flatMap((row, y) => 
            row.flatMap((value, x) => 
                value === 0 ? [{ x, y }] : []
        ));

    return startingPoints.reduce((acc, start) => getScore(start, grid, true) + acc, 0);
};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(10, isExample);
    const grid = getGrid(file);

    const startingPoints: { x: number, y: number }[] = grid
        .flatMap((row, y) => 
            row.flatMap((value, x) => 
                value === 0 ? [{ x, y }] : []
        ));

    return startingPoints.reduce((acc, start) => getScore(start, grid, false) + acc, 0);
};
