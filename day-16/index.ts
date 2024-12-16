import { readAdventOfCodeFile } from "../utils/readFile";
const getGrid = (file: string) => {
    return file.split('\n').map(line => line.split(''));
}

type Graph = Map<string, Record<string, number>>;

const directions: Record<string, { x: number, y: number }> = {
    N: { x: 0, y: -1 },
    E: { x: 1, y: 0 },
    S: { x: 0, y: 1 },
    W: { x: -1, y: 0 },
};

const orthogonalDirections: Record<string, string[]> = {
    N: ['W', 'E'],
    E: ['N', 'S'],
    S: ['E', 'W'],
    W: ['S', 'N'],
};

const isWithinBounds = (x: number, y: number, grid: string[][]) => {
    return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length;
};

const getPathInFront = (x: number, y: number, grid: string[][], direction: string): number[] | undefined => {
    const newX = x + directions[direction].x;
    const newY = y + directions[direction].y;

    if (isWithinBounds(newX, newY, grid) && grid[newY][newX] !== '#') {
        return [newX, newY];
    }
    return undefined;
};



const toGraph = (grid: string[][]): { graph: Graph, start: string, ends: string[] } => {
    const graph: Graph = new Map();
    let start: string | null = null;
    let ends: string[] = [];

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const char = grid[y][x];
            if (char === '#') {
                continue;
            }
            // For each node, it depends how we are facing

            for (const dir of Object.keys(directions)) {
                const pathInFront = getPathInFront(x, y, grid, dir);
                const node = `${dir}-${x},${y}`;
                const paths: Record<string, number> = {};
                if (pathInFront) {
                    paths[`${dir}-${pathInFront[0]},${pathInFront[1]}`] = 1;
                }
                for (const orthogonalDir of orthogonalDirections[dir]) {
                    paths[`${orthogonalDir}-${x},${y}`] = 1000;
                }
                graph.set(node, paths);
            }
            if (char === 'S') {
                // Start is facing east
                start = `E-${x},${y}`;
            }
            if (char === 'E') {
                // Cheating a bit as it seems the end is always in the top-right corner    
                ends.push(`N-${x},${y}`);
                ends.push(`E-${x},${y}`);
            }
        }
    }
    if (!start) {
        throw new Error('Start not found');
    }

    return { graph, start, ends };
}

const getNextCell = (distances: Record<string, number>, visited: Set<string>): string => {
    const cells = Object.keys(distances);

    const nextCell = cells.reduce((min: string, cell) => {
        if (visited.has(cell)) {
            return min;
        }
        if (min === '' || distances[cell] < distances[min]) {
            return cell;
        }
        return min;
    }, '');

    return nextCell;
}

const getShortestPaths = (graph: Graph, start: string, ends: string[]): string[][] => {
    const cells = Array.from(graph.keys());
    const distances: Record<string, number> = {};

    for (const cell of cells) {
        distances[cell] = Infinity;
    }
    distances[start] = 0;

    const visited: Set<string> = new Set([start]);

    const path: Record<string, string> = {};
    const startNeighbours = graph.get(start) as Record<string, number>;
    for (const neighbour of Object.keys(startNeighbours)) {
        path[neighbour] = start;
        distances[neighbour] = startNeighbours[neighbour];
    }

    let cell = start;

    while (cell) {
        const cellDistance = distances[cell];
        const neighbours = graph.get(cell) as Record<string, number>;

        for (const neighbour of Object.keys(neighbours)) {
            if (visited.has(neighbour)) {
                continue;
            }
            const neighbourDistance = neighbours[neighbour];
            const distanceToNeighbour = cellDistance + neighbourDistance;
            if (distances[neighbour] > distanceToNeighbour) {
                distances[neighbour] = distanceToNeighbour;
                path[neighbour] = cell;
            }
        }
        visited.add(cell);
        // Get closest cell that has no been visited yet
        cell = getNextCell(distances, visited);
    }

    const finalPaths: string[][] = [];
    for (const end of ends) {
        const finalPath = [end];
        let neighbour = path[end];
        while (neighbour) {
            finalPath.push(neighbour);
            neighbour = path[neighbour];
        }
        finalPath.reverse();

        finalPaths.push(finalPath);
    }

    return finalPaths;
}

const getCostOfPath = (path: string[]) => path.reduce((cost, cell, i) => {
    if (i === 0) {
        return cost;
    }
    const [dir, _] = cell.split('-');
    const prevDir = path[i - 1].split('-')[0];
    if (dir === prevDir) {
        return cost + 1;
    }
    return cost + 1000;
}, 0);

const getUniqueCellsOfPath = (path: string[]) => {
    const cells = new Set<string>();
    for (const cell of path) {
        const [_, x, y] = cell.split('-');
        cells.add(`${x},${y}`);
    }
    return cells;
}

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(16, isExample);
    const grid = getGrid(file);

    const { graph, start, ends } = toGraph(grid);

    return getShortestPaths(graph, start, ends).reduce((min, path) => Math.min(min, getCostOfPath(path)), Infinity);
};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(16, isExample);
    const grid = getGrid(file);

    const { graph, start, ends } = toGraph(grid);
    const shortestPaths = getShortestPaths(graph, start, ends);
    console.log(shortestPaths);

    const cheapestPaths = shortestPaths.reduce((paths: string[][], path: string[]) => {
        if (!paths.length) {
            paths.push(path);
            return paths;
        }
        const cost = getCostOfPath(path);
        const cheapestPath = paths[0];
        const cheapestCost = getCostOfPath(cheapestPath);
        if (cost < cheapestCost) {
            paths = [path];
            return paths;
        }
        if (cost === cheapestCost) {
            paths.push(path);
            return paths;
        }
        return paths;
    }, []);

    return cheapestPaths.reduce((cellsCount, path) => cellsCount + getUniqueCellsOfPath(path).size, 0);
};
