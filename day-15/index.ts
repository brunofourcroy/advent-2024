import { readAdventOfCodeFile } from "../utils/readFile";


const parseFile = (file: string, everythingIsBig = false) => {
    const [grid, instructions] = file.split("\n\n");

    const walls = new Set<string>();
    const boxes = new Set<string>();
    let robot = { x: 0, y: 0 };
    const gridLines = grid.split('\n');
    for (let i = 0; i < gridLines.length; i++) {
        const line = gridLines[i];
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '@') {
                if (!everythingIsBig) {
                    robot = { x: j, y: i };
                } else {
                    robot = { x: j * 2, y: i };
                }
            } else if (char === 'O') {
                if (!everythingIsBig) {
                    boxes.add(`${j},${i}`);
                } else {
                    boxes.add(`l-${j * 2},${i}`);
                    boxes.add(`r-${j * 2 + 1},${i}`);
                }
            } else if (char === '#') {
                if (!everythingIsBig) {
                    walls.add(`${j},${i}`);
                } else {
                    walls.add(`${j * 2},${i}`);
                    walls.add(`${j * 2 + 1},${i}`);
                }
            }
        }
    }

    return {
        robot,
        boxes,
        walls,
        route: instructions.split('').filter(char => char !== '\n') as Instruction[]
    }
}

type Instruction = '>' | '<' | '^' | 'v';

const instructions: Record<Instruction, { x: number, y: number }> = {
    '>': { x: 1, y: 0 },
    '<': { x: -1, y: 0 },
    '^': { x: 0, y: -1 },
    'v': { x: 0, y: 1 }
}

const canMoveBox = (box: { x: number, y: number }, instruction: Instruction, walls: Set<string>, boxes: Set<string>): boolean => {
    const nextPosition = {
        x: box.x + instructions[instruction].x,
        y: box.y + instructions[instruction].y
    }

    if (walls.has(`${nextPosition.x},${nextPosition.y}`)) {
        return false;
    }

    if (boxes.has(`${nextPosition.x},${nextPosition.y}`)) {
        return canMoveBox(nextPosition, instruction, walls, boxes);
    }

    if (boxes.has(`l-${nextPosition.x},${nextPosition.y}`)) {
        if (['^', 'v'].includes(instruction)) {
            return canMoveBox(nextPosition, instruction, walls, boxes) && canMoveBox({ x: nextPosition.x + 1, y: nextPosition.y }, instruction, walls, boxes)
        } else if (instruction === '>') {
            return canMoveBox({ x: nextPosition.x + 1, y: nextPosition.y }, instruction, walls, boxes)
        } else {
            throw new Error('Should not be pushing into the left part of a box from the right');
        }
    }

    if (boxes.has(`r-${nextPosition.x},${nextPosition.y}`)) {
        if (['^', 'v'].includes(instruction)) {
            return canMoveBox(nextPosition, instruction, walls, boxes) && canMoveBox({ x: nextPosition.x - 1, y: nextPosition.y }, instruction, walls, boxes)
        } else if (instruction === '<') {
            return canMoveBox({ x: nextPosition.x - 1, y: nextPosition.y }, instruction, walls, boxes)
        } else {
            throw new Error('Should not be pushing into the right part of a box from the left');
        }
    }

    return true;
}

const moveBox = (box: { x: number, y: number }, instruction: Instruction, walls: Set<string>, boxes: Set<string>): void => {
    const nextPosition = {
        x: box.x + instructions[instruction].x,
        y: box.y + instructions[instruction].y
    }

    // Part 1
    if (boxes.has(`${nextPosition.x},${nextPosition.y}`)) {
        moveBox(nextPosition, instruction, walls, boxes)
    }

    if (boxes.has(`l-${nextPosition.x},${nextPosition.y}`)) {
        moveBox(nextPosition, instruction, walls, boxes);
        if (['^', 'v'].includes(instruction)) {
            moveBox({ x: nextPosition.x + 1, y: nextPosition.y }, instruction, walls, boxes);
        }
    }

    if (boxes.has(`r-${nextPosition.x},${nextPosition.y}`)) {
        moveBox(nextPosition, instruction, walls, boxes);
        if (['^', 'v'].includes(instruction)) {
            moveBox({ x: nextPosition.x - 1, y: nextPosition.y }, instruction, walls, boxes);
        }
    }

    // Moving a regular / part 1 box
    if (boxes.has(`${box.x},${box.y}`)) {
        boxes.delete(`${box.x},${box.y}`);
        boxes.add(`${nextPosition.x},${nextPosition.y}`);
        return;
    }

    if (boxes.has(`l-${box.x},${box.y}`)) {
        boxes.delete(`l-${box.x},${box.y}`);
        boxes.add(`l-${nextPosition.x},${nextPosition.y}`);
        return;
    }

    if (boxes.has(`r-${box.x},${box.y}`)) {
        boxes.delete(`r-${box.x},${box.y}`);
        boxes.add(`r-${nextPosition.x},${nextPosition.y}`);
        return;
    }

    throw new Error('Trying to move something that is not a box? RUDE');
}

const moveRobot = (robot: { x: number, y: number }, instruction: Instruction, walls: Set<string>, boxes: Set<string>) => {
    const nextPosition = {
        x: robot.x + instructions[instruction].x,
        y: robot.y + instructions[instruction].y
    }

    if (walls.has(`${nextPosition.x},${nextPosition.y}`)) {
        return;
    }

    // Little boxes, part 1
    if (boxes.has(`${nextPosition.x},${nextPosition.y}`)) {
        if (!canMoveBox(nextPosition, instruction, walls, boxes)) {
            return;
        } else {
            moveBox(nextPosition, instruction, walls, boxes);
        }
    }

    if (boxes.has(`l-${nextPosition.x},${nextPosition.y}`)) {
        if (['^', 'v'].includes(instruction)) {
            // From top/bottom we need to make sure we can move both parts of the box
            if (!canMoveBox(nextPosition, instruction, walls, boxes) || !canMoveBox({ x: nextPosition.x + 1, y: nextPosition.y }, instruction, walls, boxes)) {
                return;
            }
            // Then move both
            moveBox(nextPosition, instruction, walls, boxes);
            moveBox({ x: nextPosition.x + 1, y: nextPosition.y }, instruction, walls, boxes);
        } else if (instruction === '>') {
            // From the left, we know the next cell will have the other half of the box, so we can skip one
            if (!canMoveBox({ x: nextPosition.x + 1, y: nextPosition.y }, instruction, walls, boxes)) {
                return;
            }
            moveBox(nextPosition, instruction, walls, boxes);
        } else {
            throw new Error('The robot should never move into the left part of a box from the right');
        }
    }

    if (boxes.has(`r-${nextPosition.x},${nextPosition.y}`)) {
        if (['^', 'v'].includes(instruction)) {
            // From top/bottom we need to make sure we can move both parts of the box
            if (!canMoveBox(nextPosition, instruction, walls, boxes) || !canMoveBox({ x: nextPosition.x - 1, y: nextPosition.y }, instruction, walls, boxes)) {
                return;
            }
            // Then move both
            moveBox(nextPosition, instruction, walls, boxes);
            moveBox({ x: nextPosition.x - 1, y: nextPosition.y }, instruction, walls, boxes);
        } else if (instruction === '<') {
            // From the right, we know the next cell will have the other half of the box, so we can skip one
            if (!canMoveBox({ x: nextPosition.x - 1, y: nextPosition.y }, instruction, walls, boxes)) {
                return;
            }
            moveBox(nextPosition, instruction, walls, boxes);
        } else {
            throw new Error('The robot should never move into the right part of a box from the left');
        }
    }

    robot.x = nextPosition.x;
    robot.y = nextPosition.y;
}

const printGrid = (walls: Set<string>, boxes: Set<string>, robot: { x: number, y: number }) => {
    let grid: string = '';
    for (let y = 0; y < 10; y++) {
        let line = '';
        for (let x = 0; x < 20; x++) {
            if (walls.has(`${x},${y}`)) {
                line += '#';
            } else if (boxes.has(`${x},${y}`)) {
                line += 'O';
            } else if (robot.x === x && robot.y === y) {
                line += '@';
            } else if (boxes.has(`l-${x},${y}`)) {
                line += '[';
            } else if (boxes.has(`r-${x},${y}`)) {
                line += ']';
            } else {
                line += '.';
            }
        }
        grid += line + '\n';
    }
    console.log(grid);
}

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(15, isExample);

    const { robot, boxes, walls, route } = parseFile(file);

    for (const instruction of route) {
        moveRobot(robot, instruction, walls, boxes);
    }


    return [...boxes].reduce((acc, box) => {
        const coords = box.split(',').map(Number);
        return acc + 100 * coords[1] + coords[0];
    }, 0);
};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(15, isExample);

    const { robot, boxes, walls, route } = parseFile(file, true);


    // printGrid(walls, boxes, robot);
    for (const instruction of route) {
        //console.log(instruction);
        moveRobot(robot, instruction, walls, boxes);
        //printGrid(walls, boxes, robot);
    }

    return [...boxes].reduce((acc, box) => {
        if (box.startsWith('r-')) {
            return acc;
        }
        const coords = box.replace('l-', '').split(',').map(Number);
        return acc + 100 * coords[1] + coords[0];
    }, 0);

};
