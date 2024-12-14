import { readAdventOfCodeFile } from "../utils/readFile";

type Robot = {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

type Quadrants = [Robot[], Robot[], Robot[], Robot[]];

const getRobots = (file: string): Robot[] => {
    const robots = file.split('\n').map(line => {
        const [, x, y, vx, vy] = line.split(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/);
        return { x: parseInt(x), y: parseInt(y), vx: parseInt(vx), vy: parseInt(vy) };
    });
    return robots;
}

const moveRobots = (robots: Robot[], width: number, height: number, steps: number) => {
    for (const robot of robots) {
        robot.x = (robot.x + robot.vx * steps) % width;
        if (robot.x < 0) {
            robot.x = width + robot.x;
        }
        robot.y = (robot.y + robot.vy * steps) % height;
        if (robot.y < 0) {
            robot.y = height + robot.y;
        }
    }
}

const sortRobots = (robots: Robot[], width: number, height: number): Quadrants => {
    const quadrants: Quadrants = [[], [], [], []];
    const xSplit = width % 2 === 0 ? {
        first: width / 2 - 1,
        second: width / 2
    } : {
        first: ((width - 1) / 2) - 1,
        second: (width + 1) / 2
    }
    const ySplit = height % 2 === 0 ? {
        first: height / 2 - 1,
        second: height / 2
    } : {
        first: ((height - 1) / 2) -1,
        second: (height + 1) / 2
    }
    for (const robot of robots) {
        if (robot.x <= xSplit.first) {
            if (robot.y <= ySplit.first) { 
                quadrants[0].push(robot);
            } else if (robot.y >= ySplit.second) {
                quadrants[1].push(robot);
            }
        } else if (robot.x >= xSplit.second) {
            if (robot.y <= ySplit.first) {
                quadrants[2].push(robot);
            } else if (robot.y >= ySplit.second) {
                quadrants[3].push(robot);
            }
        }
    }
    return quadrants;
}

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(14, isExample);
    const width = isExample ? 11 : 101;
    const height = isExample ? 7 : 103;
    const robots = getRobots(file);

    moveRobots(robots, width, height, 100);
    
    const quadrants = sortRobots(robots, width, height);

    return quadrants.reduce((acc, quadrant) => acc * quadrant.length, 1);
};

const printGrid = (robots: Robot[], width: number, height: number) => {
    const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => '.'));
    for (const robot of robots) {
        grid[robot.y][robot.x] = 'X';
    }
    console.log(grid.map(row => row.join('')).join('\n'));
}

const neighboringPositionsAreOccupied = (map: Record<number, number> = {}, cur: number, leftToCheck: number): boolean => {
    if (leftToCheck === 0) {
        return true;
    }
    if (map[cur + 1] >= 1) {
        return neighboringPositionsAreOccupied(map, cur + 1, leftToCheck - 1);
    }
    return false;
}

const couldBeTree = (robots: Robot[], width: number, height: number) => {
    const map: Record<number, Record<number, number>> = {};
    for (const robot of robots) {
        if (!map[robot.x]) {
            map[robot.x] = {};
        }
        map[robot.x][robot.y] = (map[robot.x][robot.y] || 0) + 1;
    }
    const columns = Object.entries(map);

    // Find if at least 10 are next to each other
    let longLine = false;
    for (let i = 0; i < columns.length; i++) {
        const [X, values] = columns[i];

        const cells = Object.entries(values);
        for (let j = 0; j < cells.length; j++) {
            const [Y, value] = cells[j];
            if (value && neighboringPositionsAreOccupied(values, parseInt(Y), 10)) {
                longLine = true;
                break;
            }
        }
        if (longLine) {
            break;
        }
    }

    return longLine;
}

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(14, isExample);
    const width = isExample ? 11 : 101;
    const height = isExample ? 7 : 103;
    const robots = getRobots(file);

    let count = 0;
    while (true) {
        moveRobots(robots, width, height, 1);
        count += 1;
        if (couldBeTree(robots, width, height)) {
            printGrid(robots, width, height);
            break;
        }
    }
    return count;
};
