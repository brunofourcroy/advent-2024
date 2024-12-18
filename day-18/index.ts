import { readAdventOfCodeFile } from "../utils/readFile";

const getFallingBytes = (file: string): number[][] => {
    return file.split('\n').map(line => line.split(',').map(Number));
}


type Graph = Map<string, Record<string, number>>;

const directions: Record<string, { x: number, y: number }> = {
    N: { x: 0, y: -1 },
    E: { x: 1, y: 0 },
    S: { x: 0, y: 1 },
    W: { x: -1, y: 0 },
};

const isWithinBounds = (x: number, y: number, width: number, height: number): boolean => {
    return x >= 0 && x < width && y >= 0 && y < height;
};

const toGraph = (occupied: Set<string>, width: number, height: number): Graph => {
    const graph: Graph = new Map();

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const node = `${x},${y}`;
            const isOccupied = occupied.has(node);
            if (isOccupied) {
                continue;
            }

            const paths: Record<string, number> = {};

            for (const dir of Object.keys(directions)) {
                const neighbour = [x + directions[dir].x, y + directions[dir].y];
                const neighbourNode = `${x + directions[dir].x},${y + directions[dir].y}`;
                if (isWithinBounds(x + directions[dir].x, y + directions[dir].y, width, height) && !occupied.has(neighbourNode)) {
                    paths[`${neighbour[0]},${neighbour[1]}`] = 1;
                }
            }
            graph.set(node, paths);
        }
    }

    return graph;
}

type QueuedCell = {
    cell: string;
    distance: number;
}

const getShortestPath = (graph: Graph, start: string, end: string): string[] => {
    const cells = Array.from(graph.keys());
    const distances: Record<string, number> = {};

    for (const cell of cells) {
        distances[cell] = Infinity;
    }
    distances[start] = 0;

    const queue: QueuedCell[] = [];
    queue.push({ cell: start, distance: 0 });

    const paths: Record<string, string[]> = {};
    paths[start] = [];

    while (queue.length) {
        const { cell } = queue.pop() as QueuedCell;
        const neighbours = graph.get(cell) as Record<string, number>;
        for (const neighbour of Object.keys(neighbours)) {
            const distance = distances[cell] + neighbours[neighbour];
            if (distance < distances[neighbour]) {
                distances[neighbour] = distance;
                paths[neighbour] = [cell];
                queue.push({ cell: neighbour, distance });
                queue.sort((a, b) => b.distance - a.distance);
            } else if (distance === distances[neighbour]) {
                paths[neighbour].push(cell);
            }
        }
    }

    const finalPath = [];
    const stack = [end];
    while (stack.length) {
        const cell = stack.pop() as string;
        finalPath.push(cell);
        if (paths[cell]?.[0]) {
            stack.push(paths[cell][0]);
        }
    }

    return finalPath;
}

export const solveStep1 = async (isExample: boolean, width: number, height: number, nbOfBytes: number): Promise<number> => {
    const file = await readAdventOfCodeFile(18, isExample);
    const fallingBytes = getFallingBytes(file).slice(0, nbOfBytes);
    const occupied = new Set(fallingBytes.map(byte => `${byte[0]},${byte[1]}`));

    const graph = toGraph(occupied, width, height);
    const shortestPath = getShortestPath(graph, '0,0', `${width - 1},${height - 1}`);

    return shortestPath.length - 1;
};

export const solveStep2 = async (isExample: boolean, width: number, height: number): Promise<string> => {
    const file = await readAdventOfCodeFile(18, isExample);
    const fallingBytes = getFallingBytes(file)

    let fallenBytesCount = 1;
    let firstBlockingByte = null;
    const occupied = new Set<string>();
    let cellsOnShortestPath = new Set<string>();
    while (true) {
        const newByte = fallingBytes[fallenBytesCount - 1];
        if (!newByte) {
            break;
        }
        if (occupied.has(`${newByte[0]},${newByte[1]}`)) {
            // That cell was already occuped, no need to check it again
            fallenBytesCount++;
            continue;
        }
        occupied.add(`${newByte[0]},${newByte[1]}`);
        if (cellsOnShortestPath.size > 0 && !cellsOnShortestPath.has(`${newByte[0]},${newByte[1]}`)) {
            // The new cell was not on the shortest path so it will not change anything
            fallenBytesCount++;
            continue;
        }
        const graph = toGraph(occupied, width, height);
        const shortestPath = getShortestPath(graph, '0,0', `${width - 1},${height - 1}`);
        if (shortestPath.length === 1) {
            firstBlockingByte = `${newByte[0]},${newByte[1]}`;
            break;
        }
        cellsOnShortestPath = new Set(shortestPath);
        fallenBytesCount++;
    }

    if (!firstBlockingByte) {
        throw new Error('No blocking byte found');
    }

    return firstBlockingByte;
};
