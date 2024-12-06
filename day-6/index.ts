import { readAdventOfCodeFile } from "../utils/readFile";

type Guard = {
    position: [number, number];
    direction: string;
}

type Cell = {
    type: '.' | '#' | 'X' | '^' | '>' | 'v' | '<',
    visitedDirections: string[];
}

type Grid = Cell[][]


const getGrid = (file: string): Grid => {
    return file.split('\n').filter(Boolean).map(line => line.split('').map(char => ({ type: char as Cell['type'], visitedDirections: [] })));
}

const printGrid = (grid: Grid): void => {
    console.log(grid.map(line => line.map(cell => cell.type).join('')).join('\n'));
}

const getGuard = (grid: Grid): Guard => {
    let guardPos: [number, number] = [0, 0];
    for (let i = 0; i < grid.length; i++) {
        const line = grid[i];
        const pos = line.findIndex(cell => cell.type === '^');
        if (pos !== -1) {
            guardPos = [i, pos];
            break;
        }
    }
    return { position: guardPos, direction: '^' };
}

const isWithinGrid = (grid: Grid, position: [number, number]): boolean => {
    return position[0] >= 0 && position[0] < grid.length && position[1] >= 0 && position[1] < grid[position[0]].length;
}

const getNextDirection = (direction: string): string => {
    if (direction === '^') {
        return '>';
    } else if (direction === '>') {
        return 'v';
    } else if (direction === 'v') {
        return '<';
    } else if (direction === '<') {
        return '^';
    }
    throw new Error('Invalid guard direction');
}

const rotateGuard = (guard: Guard): Guard => {
    const { direction } = guard;
    return { ...guard, direction: getNextDirection(direction) };
}
const getPositionInFrontOfGuard = (guard: Guard): [number, number] => {
    const { position, direction } = guard;
    const newPosition = [...position];
    if (direction === '^') {
        newPosition[0]--;
    } else if (direction === 'v') {
        newPosition[0]++;
    } else if (direction === '>') {
        newPosition[1]++;
    } else if (direction === '<') {
        newPosition[1]--;
    }
    return [newPosition[0], newPosition[1]];
}

const weHaveBeenHereBefore = (grid: Grid, guard: Guard): boolean => {
    const { position, direction } = guard;
    const currentCell = grid[position[0]]?.[position[1]];
    if (!currentCell) {
        // They got out!
        return false;
    }
    if (currentCell.type !== 'X') {
        // First time!
        return false;
    }

    if (!currentCell.visitedDirections.includes(direction)) {
        // First time in this direction!
        return false;
    }

    return true;
}

const copyGrid = (grid: Grid): Grid => {
    return grid.map(line => line.map(cell => ({ ...cell, visitedDirections: [...(cell.visitedDirections ?? [])] })));
}

const couldEnterInfiniteLoop = (guard: Guard, grid: Grid): boolean => {
    const inFront = getPositionInFrontOfGuard(guard);

    // If guard is facing outside, no infinite loop
    if (!isWithinGrid(grid, inFront)) {
        return false;
    }
    const imaginaryGrid = copyGrid(grid);
    // Place imaginary obstacle in front of guard
    imaginaryGrid[inFront[0]][inFront[1]] = { type: '#', visitedDirections: [] };

    let imaginaryGuard: Guard = { ...guard, position: [...guard.position] };
    while (isWithinGrid(imaginaryGrid, imaginaryGuard.position)) {
        const move = moveGuard(imaginaryGuard, imaginaryGrid, false);
        imaginaryGuard = move.guard;
        if (weHaveBeenHereBefore(imaginaryGrid, imaginaryGuard)) {
            return true;
        }
    }
    return false;
}

const moveGuard = (guard: Guard, grid: Grid, checkForInfiniteLoop = true): { guard: Guard, couldHaveEnteredInfiniteLoop: boolean; } => {
    const { position } = guard;
    let couldHaveEnteredInfiniteLoop = false;
    // Record we've been here
    grid[position[0]][position[1]].type = 'X';
    grid[position[0]][position[1]].visitedDirections.push(guard.direction);

    const inFront = getPositionInFrontOfGuard(guard);

    // Obstacle, we turn right
    if (grid[inFront[0]]?.[inFront[1]]?.type === '#') {
        const rotatedGuard = rotateGuard(guard);
        return moveGuard(rotatedGuard, grid, checkForInfiniteLoop);
    }

    // No obstacle, but what if?
    if (checkForInfiniteLoop && couldEnterInfiniteLoop(guard, grid)) {
        couldHaveEnteredInfiniteLoop = true;
    }

    // Move forward
    guard.position = inFront;

    return { guard, couldHaveEnteredInfiniteLoop };
}

const countCellsTraversed = (grid: Grid): number => {
    return grid.flat().filter(cell => cell.type === 'X').length;
}

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(6, isExample);
    const grid = getGrid(file);

    let guard = getGuard(grid);
    while (isWithinGrid(grid, guard.position)) {
        const move = moveGuard(guard, grid, false);
        guard = move.guard;
    }

    return countCellsTraversed(grid);
};

export const solveStep2SmarterButBroken = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(6, isExample);
    const grid = getGrid(file);

    let guard = getGuard(grid);
    let potentialInfiniteLoops = 0;
    while (isWithinGrid(grid, guard.position)) {
        const move = moveGuard(guard, grid);
        guard = move.guard;
        if (move.couldHaveEnteredInfiniteLoop) {
            potentialInfiniteLoops++;
        }
    }

    return potentialInfiniteLoops;
};


export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(6, isExample);
    const grid = getGrid(file);

    // Try to place an obstacle in every cell
    let scenariosCausingInfiniteLoops = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const cell = grid[i][j];
            if (cell.type === '.') {
                const imaginaryGrid = copyGrid(grid);
                imaginaryGrid[i][j] = { ...cell, type: '#' };

                let guard = getGuard(grid);
                while (isWithinGrid(imaginaryGrid, guard.position)) {
                    const move = moveGuard(guard, imaginaryGrid, false);
                    guard = move.guard;
                    if (weHaveBeenHereBefore(imaginaryGrid, guard)) {
                        scenariosCausingInfiniteLoops += 1;
                        break;;
                    }
                }
            }   
        }
    }
    return scenariosCausingInfiniteLoops;
}
