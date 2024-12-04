import { readAdventOfCodeFile } from "../utils/readFile";


const getGrid = (input: string): string[][] => {
    return input.split("\n").map((row) => row.split(""));
}

const diagonalDirections = {
    downRight: [1, 1],
    downLeft: [1, -1],
    upRight: [-1, 1],
    upLeft: [-1, -1],
}

const directions = {
    right: [0, 1],
    down: [1, 0],
    left: [0, -1],
    up: [-1, 0],
    ...diagonalDirections,
}

const opposites: Record<keyof typeof directions, keyof typeof directions> = {
    right: 'left',
    left: 'right',
    down: 'up',
    up: 'down',
    downRight: 'upLeft',
    downLeft: 'upRight',
    upRight: 'downLeft',
    upLeft: 'downRight',
}

const countXMasesFromX = (grid: string[][], row: number, col: number): number => {
    let matches = 0;
    
    for (const direction of Object.values(directions)) {
        let currentRow = row;
        let currentCol = col;
        let currentWord = 'X';
        for (let i = 0; i < 3; i++) {
            currentRow += direction[0];
            currentCol += direction[1];
            if (currentRow < 0 || currentRow >= grid.length || currentCol < 0 || currentCol >= grid[currentRow].length) {
                break;
            }
            currentWord += grid[currentRow][currentCol];
            if (i === 0 && currentWord !== 'XM') {
                break;
            }
            if (i === 1 && currentWord !== 'XMA') {
                break;
            }
            if (currentWord === 'XMAS') {
                matches += 1;
            }
        }
    }
    return matches;
}

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(4, isExample);
    const grid = getGrid(file);

    let xMases = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const cell = grid[row][col];
            if (cell === 'X') {
                xMases += countXMasesFromX(grid, row, col);
            }
        }
    }
    return xMases;
};

const isMiddleOfCross = (grid: string[][], row: number, col: number): boolean => {
    let mases = 0

    if (row === 0 || row === grid.length - 1 || col === 0 || col === grid[row].length - 1) {
        return false;
    }

    for (const [key, direction] of Object.entries(diagonalDirections)) {
        const currentRow = row + direction[0];
        const currentCol = col + direction[1];

        if (grid[currentRow][currentCol] === 'M') {
            const oppositeDirection = directions[opposites[key as keyof typeof opposites]];

            const oppositeRow = row + oppositeDirection[0];
            const oppositeCol = col + oppositeDirection[1];
            if (grid[oppositeRow][oppositeCol] === 'S') {
                mases += 1;
            }
        }
    }

    return mases === 2;
}

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(4, isExample);
    const grid = getGrid(file);

    let crossMases = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const cell = grid[row][col];
            if (cell === 'A') {
                if (isMiddleOfCross(grid, row, col)) {
                    crossMases += 1;
                }
            }
        }
    }
    return crossMases;
};
