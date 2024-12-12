import { readAdventOfCodeFile } from "../utils/readFile";

type Region = { key: string, cells: [number, number][] };
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


const getArea = (region: Region): number => region.cells.length;

const getIdenticalNeighbours = (grid: string[][], cell: [number, number]): [number, number][] => {
    return getNeighbours(grid, cell).filter(([x, y]) => grid[x][y] === grid[cell[0]][cell[1]]);
};

const getNeighbours = (grid: string[][], cell: [number, number], includeEdge: boolean = false): [number, number][] => {
    return Object.values(directions).map(([dx, dy]): [number, number] => [cell[0] + dx, cell[1] + dy]).filter(([x, y]) => (includeEdge ? true : x >= 0 && y >= 0 && x < grid.length && y < grid[0].length));
};


const getNeighboursInRegion = (grid: string[][], region: Region, cell: [number, number]): [number, number][] => {
    return getNeighbours(grid, cell, true).filter(([x, y]) => region.cells.some(([rx, ry]) => rx === x && ry === y));
};

const countNeighboursInRegion = (grid: string[][], region: Region, cell: [number, number]): number => {
    return getNeighboursInRegion(grid, region, cell).length;
};

const getPerimeter = (grid: string[][], region: Region): number => region.cells.reduce((acc, cell) => {
    return acc + 4 - countNeighboursInRegion(grid, region, cell);
}, 0);


const expandRegion = (grid: string[][], region: Region, origin: [number, number], traversedMap: Map<string, boolean>): Region => {
    if (traversedMap.get(`${origin[0]},${origin[1]}`)) {
        return region;
    }
    traversedMap.set(`${origin[0]},${origin[1]}`, true);
    region.cells.push(origin);

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
            const region = expandRegion(grid, { key: `${grid[i][j]}-${i}-${j}`, cells: [] }, [i, j], traversedMap);
            if (region.cells.length > 0) {
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

export const getAllSides = (grid: string[][], regions: Region[]): Map<string, [number, number][]> => {
    const easyAccessRegions: Map<string, Set<string>> = new Map();
    const easyAccessCells: Map<string, string> = new Map();
    const corners: Map<string, [number, number][]> = new Map();
    for (const region of regions) {
        easyAccessRegions.set(region.key, new Set());
        corners.set(region.key, []);
        for (const cell of region.cells) {
            easyAccessRegions.get(region.key)?.add(`${cell[0]},${cell[1]}`);
            easyAccessCells.set(`${cell[0]},${cell[1]}`, region.key);
        }
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const regionKey = easyAccessCells.get(`${i},${j}`) as string;
            const region = easyAccessRegions.get(regionKey) as Set<string>;
            const neighbours = getNeighboursKeyedByDirection(grid, [i, j], region);
            if (!neighbours.up.inRegion && !neighbours.right.inRegion) {
                corners.get(regionKey)?.push([i, j]);
            }
            if (!neighbours.up.inRegion && !neighbours.left.inRegion) {
                corners.get(regionKey)?.push([i, j]);
            }
            if (!neighbours.down.inRegion && !neighbours.right.inRegion) {
                corners.get(regionKey)?.push([i, j]);
            }
            if (!neighbours.down.inRegion && !neighbours.left.inRegion) {
                corners.get(regionKey)?.push([i, j]);
            }
            if (neighbours.up.inRegion && neighbours.right.inRegion) {
                if (!isInRegion([i -1, j + 1], region)) {
                    corners.get(regionKey)?.push([i, j]);
                }
            }
            if (neighbours.up.inRegion && neighbours.left.inRegion) {
                if (!isInRegion([i - 1, j - 1], region)) {
                    corners.get(regionKey)?.push([i, j]);
                }
            }
            if (neighbours.down.inRegion && neighbours.right.inRegion) {
                if (!isInRegion([i + 1, j + 1], region)) {
                    corners.get(regionKey)?.push([i, j]);
                }
            }
            if (neighbours.down.inRegion && neighbours.left.inRegion) {
                if (!isInRegion([i + 1, j - 1], region)) {
                    corners.get(regionKey)?.push([i, j]);
                }
            }
        }
    }
    return corners;
};



export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(12, isExample);
    const grid = getGrid(file);

    const regions = getRegions(grid);

    const sides = getAllSides(grid, regions);

    return regions.map(region => {
        return getArea(region) * (sides.get(region.key)?.length || 0);
    }).reduce((a, b) => a + b, 0);
};
