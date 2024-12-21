import { readAdventOfCodeFile } from "../utils/readFile";

type Graph = Map<string, Record<string, number>>;

type Position = [number, number];   

const isWithinBounds = (x: number, y: number, grid: string[][]) => {
  return x >= 0 && y >= 0 && x < grid[0].length && y < grid.length;
};

const directions: Record<string, { x: number; y: number }> = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
};

const getValidNeighbours = (
  x: number,
  y: number,
  grid: string[][]
): Position[] => {
  return Object.values(directions).reduce((acc: Position[], dir) => {
    const neighbour: Position = [x + dir.x, y + dir.y];
    if (isWithinBounds(neighbour[0], neighbour[1], grid)) {
      acc.push(neighbour);
    }
    return acc;
  }, []);
};

const toGraph = (grid: string[][]): { graph: Graph, start: string, end: string; } => {
  const graph: Graph = new Map();
  let start: string = ''; 
  let end: string = '';
  for (let y = 0; y < grid.length; y++) {
    const cells = grid[y];
    for (let x = 0; x < cells.length; x++) {
      const cell = grid[y][x];
      if (cell === "#") {
        continue;
      }
      const node = `${x},${y}`;
      if (cell === 'S') {
        start = node;
      }
      if (cell === 'E') {
        end = node;
      }
      const paths: Record<string, number> = {} = {};
      const neighbours = getValidNeighbours(x, y, grid);
      for (const neighbour of neighbours) {
        if (grid[neighbour[1]][neighbour[0]] !== '#') {
            paths[`${neighbour[0]},${neighbour[1]}`] = 1;
        }
      }

      graph.set(node, paths);
    }
  }

  return { graph, start, end };
};

class PriorityQueue<T> {
    private heap: [number, T][] = [];

    enqueue(item: T, priority: number) {
        this.heap.push([priority, item]);
        this.bubbleUp(this.heap.length - 1);
    }

    bubbleUp(index: number) {
        while (index > 0) {
            const nextIndex = Math.floor((index - 1) / 2);
            if (this.heap[nextIndex][0] >= this.heap[index][0]) {
                break;
            }

            [this.heap[nextIndex], this.heap[index]] = [this.heap[index], this.heap[nextIndex]];
            index = nextIndex;
        }
    }

    dequeue(): T | undefined {
        if (this.heap.length === 0) {
            return undefined;
        }

        const result = this.heap[0][1];
        const backOfTheHeap = this.heap.pop();
        if (!backOfTheHeap) {
            throw new Error('Come on TS, I just checked the length, you should be able to work this out');
        }
        if (this.heap.length > 0) {
            this.heap[0] = backOfTheHeap;
            this.bubbleDown(0);
        }

        return result;
    }

    bubbleDown(index: number) {
        while (true) {
            let largest = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < this.heap.length && this.heap[leftChild][0] > this.heap[largest][0]) {
                largest = leftChild;
            }
            if (rightChild < this.heap.length && this.heap[rightChild][0] > this.heap[largest][0]) {
                largest = rightChild;
            }

            if (largest === index) { 
                break;
            }

            [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
            index = largest;
        }
    }

    get length(): number {
        return this.heap.length;
    }
}

const coordCache = new Map<string, Position>();
const parseCoordinates = (pos: string): Position => {
    const cached = coordCache.get(pos);
    if (cached) {
        return cached;
    }
    const [x, y] = pos.split(',').map(Number);
    coordCache.set(pos, [x, y]);
    return [x, y];
}

const getManhattanDistance = (pos1: string, pos2: string) => {
    const [x1, y1] = parseCoordinates(pos1);
    const [x2, y2] = parseCoordinates(pos2);

    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

const getShortestPath = (graph: Graph, start: string, end: string): string[] => {
    const distances: Record<string, number> = { [start]: 0 };    
    const paths: Record<string, string[]> = { [start]: [] };
    const queue = new PriorityQueue<string>();
    const visited = new Set<string>();

    queue.enqueue(start, getManhattanDistance(start, end));

    while (queue.length) {
        const cell = queue.dequeue();
        if (!cell) {
            throw new Error('Empty queue?');
        }
        if (cell === end) {
            break;
        }
        if (visited.has(cell)) {
            continue;
        }
        visited.add(cell);

        const neighbours = graph.get(cell);
        if (!neighbours) {
            continue;
        }
        for (const [neighbour, cost] of Object.entries(neighbours)) {
            if (visited.has(neighbour)) {
                continue;
            }
            const distance = distances[cell] + cost;

            if (!(neighbour in distances) || distance < distances[neighbour]) {
                distances[neighbour] = distance;
                paths[neighbour] = [cell];
                queue.enqueue(neighbour, getManhattanDistance(neighbour, end) - distance);
            } else if (distance === distances[neighbour]) {
                paths[neighbour].push(cell);
            }
        }
    }

    const finalPath = [];
    let current = end;
    while (current !== start) {
        finalPath.push(current);
        current = paths[current][0];
    }
    finalPath.push(start);

    return finalPath;
}

const getPossibleCheats = (grid: string[][]): Position[][] => {
    const cheats: Position[][] = [];


  // The maze is surrounded by walls that we can ignore
  for (let y = 1; y < grid.length - 1; y++) {
    for (let x = 1; x < grid[y].length - 1; x++) {
        const cell = grid[y][x];
        if (cell !== '#') {
            continue;
        }

        // Look for walls that are between two open paths with a gap of exactly 1
        // Horizontal shortcuts
        if (grid[y][x-1] !== '#' && grid[y][x+1] !== '#') {
            cheats.push([[x-1, y], [x, y]]);
        }
        
        // Vertical shortcuts
        if (grid[y-1][x] !== '#' && grid[y+1][x] !== '#') {
            cheats.push([[x, y-1], [x, y]]);
        }
    }
  }

  return cheats;
};

const addPaths = (graph: Map<string, Record<string, number>>, shortcut: [Position, Position, number]) => {
    const [from, to, wallCount] = shortcut;
    const fromNode = `${from[0]},${from[1]}`;
    const toNode = `${to[0]},${to[1]}`;
    
    // The cost should be wallCount + 1 (for the final step)
    const pathCost = wallCount + 1;
    
    // Create paths from the new node
    const paths: Record<string, number> = {};
    for (const direction of Object.values(directions)) {
        const neighbour = [to[0] + direction.x, to[1] + direction.y];
        if (neighbour[0] === from[0] && neighbour[1] === from[1]) {
            continue;
        }
        const neighbourInGraph = graph.get(`${neighbour[0]},${neighbour[1]}`);
        if (!neighbourInGraph) {
            continue;
        }
        paths[`${neighbour[0]},${neighbour[1]}`] = 1;  // Normal moves still cost 1
        
        graph.set(`${neighbour[0]},${neighbour[1]}`, {
            ...neighbourInGraph,
            [toNode]: 1
        });
    }

    graph.set(toNode, paths);
    
    const entranceInGraph = graph.get(fromNode);
    if (!entranceInGraph) {
        throw new Error('First part of shortcut should always be in the graph already');
    }
    
    // Add the shortcut with proper cost
    graph.set(fromNode, { ...entranceInGraph, [toNode]: pathCost });
    graph.set(toNode, { ...paths, [fromNode]: pathCost });

    return graph;
};

const cleanUp = (graph: Graph, cheats: Position[]) => {
    const toRemove = `${cheats[1][0]},${cheats[1][1]}`;
    graph.delete(toRemove);

    const toReset = `${cheats[0][0]},${cheats[0][1]}`;
    const toResetValues = graph.get(toReset);
    if (!toResetValues) {
        throw new Error('Should not happen');
    }
    delete toResetValues[toRemove];

    graph.set(toReset, toResetValues);

    return graph;
};

export const solveStep1 = async (
  isExample: boolean,
  worthyCheck: number
): Promise<number> => {
  const file = await readAdventOfCodeFile(20, isExample);
  const grid: string[][] = file.split("\n").map((row) => row.split(""));
  let { graph, start, end } = toGraph(grid);

  const shortestLegitPath = getShortestPath(graph, start, end);

  const possibleCheats = getPossibleCheats(grid);
  const shortcuts: Record<number, number> = {};
  for (const cheat of possibleCheats) {
    const newGraph = addPaths(graph, [cheat[0], cheat[1], 1]);
    const newPath = getShortestPath(newGraph, start, end);
    if (newPath.length < shortestLegitPath.length) {
        const saved = shortestLegitPath.length - newPath.length;
        shortcuts[saved] = (shortcuts[saved] ?? 0) + 1;
    }
    // Attempt to prevent having to duplicate the graph each time
    graph = cleanUp(graph, cheat);
  }

  return Object.entries(shortcuts).reduce((acc: number, [value, count]) => {
    if (Number(value) >= worthyCheck) {
        return acc + count;
    }
    return acc;
  }, 0);
};


const findLongShortcuts = (grid: string[][], maxLength: number = 19): [Position, Position, number][] => {
    const shortcuts: [Position, Position, number][] = [];
    
    // For each open space in the grid
    for (let y = 1; y < grid.length - 1; y++) {
        for (let x = 1; x < grid[0].length - 1; x++) {
            if (grid[y][x] === '#') continue;
            
            const visited = new Set<string>();
            
            const queue: { pos: Position, path: Position[], walls: number }[] = [
                { pos: [x, y], path: [[x, y]], walls: 0 }
            ];
            
            while (queue.length > 0) {
                const current = queue.shift()!;
                const currentKey = `${current.pos[0]},${current.pos[1]}`;
                
                if (visited.has(currentKey)) continue;
                visited.add(currentKey);
                
                for (const dir of Object.values(directions)) {
                    const nextPos: Position = [
                        current.pos[0] + dir.x,
                        current.pos[1] + dir.y
                    ];
                    
                    if (!isWithinBounds(nextPos[0], nextPos[1], grid)) continue;
                    
                    const isWall = grid[nextPos[1]][nextPos[0]] === '#';
                    const nextWalls = current.walls + (isWall ? 1 : 0);
                    
                    if (nextWalls <= maxLength && 
                        !(nextPos[0] === x && nextPos[1] === y)) {
                        
                        if (current.walls > 0 && !isWall) {
                            shortcuts.push([
                                [x, y],
                                nextPos,
                                current.walls  // Include wall count in shortcut
                            ]);
                        }
                        
                        if (nextWalls < maxLength) {
                            queue.push({
                                pos: nextPos,
                                path: [...current.path, nextPos],
                                walls: nextWalls
                            });
                        }
                    }
                }
            }
        }
    }
    
    return shortcuts;
};

export const solveStep2 = async (isExample: boolean, worthyCheck: number): Promise<number> => {
    const file = await readAdventOfCodeFile(20, isExample);
    const grid: string[][] = file.split("\n").map((row) => row.split(""));
    const { graph, start, end } = toGraph(grid);

    const shortestLegitPath = getShortestPath(graph, start, end);
    const possibleShortcuts = findLongShortcuts(grid);
    
    // Deduplicate shortcuts first
    const uniqueShortcuts = new Set<string>();
    for (const [from, to] of possibleShortcuts) {
        uniqueShortcuts.add(`${from[0]},${from[1]}->${to[0]},${to[1]}`);
    }
    
    // Track shortcuts by how many steps they save
    const worthyShortcuts: Record<number, string[]> = {};
    
    for (const shortcut of uniqueShortcuts) {
        const [fromStr, toStr] = shortcut.split('->');
        const from = fromStr.split(',').map(Number) as [number, number];
        const to = toStr.split(',').map(Number) as [number, number];
        
        // Find the original shortcut with its wall count
        const originalShortcut = possibleShortcuts.find(
            ([f, t]) => f[0] === from[0] && f[1] === from[1] && t[0] === to[0] && t[1] === to[1]
        );
        if (!originalShortcut) continue;
        
        const newGraph = addPaths(structuredClone(graph), originalShortcut);
        const newPath = getShortestPath(newGraph, start, end);
        const saved = shortestLegitPath.length - newPath.length;
        if (saved >= worthyCheck) {
            worthyShortcuts[saved] = worthyShortcuts[saved] || [];
            worthyShortcuts[saved].push(shortcut);
        }
    }

    console.log(worthyShortcuts); // This will show the groupings

    return Object.values(worthyShortcuts).reduce((acc, shortcuts) => acc + shortcuts.length, 0);
};
