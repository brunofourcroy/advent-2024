import { readAdventOfCodeFile } from "../utils/readFile";

type Region = [number, number][];
type RegionMap = Map<string, {edges: string[]}>;

const directions: { [key: string]: [number, number] } = {
    'right': [0, 1],
    'down': [1, 0],
    'left': [0, -1],
    'up': [-1, 0]
};

const getGrid = (file: string): string[][] => {
    return file.split('\n').map(line => line.split(''));
};


const getArea = (region: Region): number => region.length;

const getIdenticalNeighbours = (grid: string[][], cell: [number, number]): [number, number][] => {
    return getNeighbours(grid, cell).filter(([x, y]) => grid[x][y] === grid[cell[0]][cell[1]]);
};

const getNeighbours = (grid: string[][], cell: [number, number], includeEdge: boolean = false): [number, number][] => {
    return Object.values(directions).map(([dx, dy]): [number, number] => [cell[0] + dx, cell[1] + dy]).filter(([x, y]) => (includeEdge ? true : x >= 0 && y >= 0 && x < grid.length && y < grid[0].length));
};


const getNeighboursInRegion = (grid: string[][], region: Region, cell: [number, number]): [number, number][] => {
    return getNeighbours(grid, cell, true).filter(([x, y]) => region.some(([rx, ry]) => rx === x && ry === y));
};

const countNeighboursInRegion = (grid: string[][], region: Region, cell: [number, number]): number => {
    return getNeighboursInRegion(grid, region, cell).length;
};

const getPerimeter = (grid: string[][], region: Region): number => region.reduce((acc, cell) => {
    return acc + 4 - countNeighboursInRegion(grid, region, cell);
}, 0);


const expandRegion = (grid: string[][], region: Region, origin: [number, number], traversedMap: Map<string, boolean>): Region => {
    if (traversedMap.get(`${origin[0]},${origin[1]}`)) {
        return region;
    }
    traversedMap.set(`${origin[0]},${origin[1]}`, true);
    region.push(origin);

    const neighbours = getIdenticalNeighbours(grid, origin);

    for (const neighbour of neighbours) {
        expandRegion(grid, region, neighbour, traversedMap);
    }
    return region;
};

const getRegions = (grid: string[][]): Region[] => {
    const traversedMap: Map<string, boolean> = new Map();
    const regions: Region[] = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const region = expandRegion(grid, [], [i, j], traversedMap);
            if (region.length > 0) {
                regions.push(region);
            }
        }
    }
    return regions;
};

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(12, isExample);
    const grid = getGrid(file);

    const regions = getRegions(grid);

    return regions.map(region => {
        return getArea(region) * getPerimeter(grid, region);
    }).reduce((a, b) => a + b, 0);
};


const isInRegion = (cell: [number, number], region: Set<string>): boolean => {
    return region.has(`${cell[0]},${cell[1]}`);
};



const getNeighboursKeyedByDirection = (grid: string[][], cell: [number, number], region: Set<string>): { [key: string]: { cell: [number, number], inRegion: boolean } } => {
    return Object.entries(directions).reduce((acc, [key, [dx, dy]]) => { 
        return {
            ...acc,
            [key]: {
                cell: [cell[0] + dx, cell[1] + dy],
                inRegion: isInRegion([cell[0] + dx, cell[1] + dy], region)
            }
        }
     }, {});
};

export const getNumberOfSides = (grid: string[][], region: Region): number => {
    const easyAccessRegion: Set<string> = new Set();
    const corner = [];
    for (const cell of region) {
        easyAccessRegion.add(`${cell[0]},${cell[1]}`);
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const inRegion = isInRegion([i, j], easyAccessRegion);
            const neighbours = getNeighboursKeyedByDirection(grid, [i, j], easyAccessRegion);
            if (inRegion) {
                if (!neighbours.up.inRegion && !neighbours.right.inRegion) {
                    corner.push([i, j]);
                }
                if (!neighbours.up.inRegion && !neighbours.left.inRegion) {
                    corner.push([i, j]);
                }
                if (!neighbours.down.inRegion && !neighbours.right.inRegion) {
                    corner.push([i, j]);
                }
                if (!neighbours.down.inRegion && !neighbours.left.inRegion) {
                    corner.push([i, j]);
                }
                if (neighbours.up.inRegion && neighbours.right.inRegion) {
                    if (!isInRegion([i -1, j + 1], easyAccessRegion)) {
                        corner.push([i, j]);
                    }
                }
                if (neighbours.up.inRegion && neighbours.left.inRegion) {
                    if (!isInRegion([i - 1, j - 1], easyAccessRegion)) {
                        corner.push([i, j]);
                    }
                }
                if (neighbours.down.inRegion && neighbours.right.inRegion) {
                    if (!isInRegion([i + 1, j + 1], easyAccessRegion)) {
                        corner.push([i, j]);
                    }
                }
                if (neighbours.down.inRegion && neighbours.left.inRegion) {
                    if (!isInRegion([i + 1, j - 1], easyAccessRegion)) {
                        corner.push([i, j]);
                    }
                }
            }
        }
    }
    return corner.length;
};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(12, isExample);
    const grid = getGrid(file);

    const regions = getRegions(grid);

    return regions.map(region => {
        return getArea(region) * getNumberOfSides(grid, region);
    }).reduce((a, b) => a + b, 0);
};
