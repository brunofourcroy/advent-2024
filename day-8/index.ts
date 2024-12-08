import { readAdventOfCodeFile } from "../utils/readFile";

type AntennaMap = Map<string, Antenna[]>;

type Antenna = [number, number];

const parseFile = (file: string): { map: AntennaMap, height: number } => {
    const lines = file.split('\n');
    lines.pop();

    const map = new Map<string, Antenna[]>();

    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            if (char !== '.') {
               if (map.get(char)) {
                map.get(char)?.push([x, y]);
               } else {
                map.set(char, [[x, y]]);
               }
            }
        });
    });

    return { map, height: lines.length };
};

const isWithinBounds = (antenna: Antenna, height: number): boolean => 
    antenna[0] < height && antenna[1] < height && antenna[0] >= 0 && antenna[1] >= 0;



const keepFillingUntilOutOfBounds = (initialPos: Antenna, xDir: number, yDir: number, size: number): Antenna[] => {    
    if (!isWithinBounds(initialPos, size)) {
        return [];
    }
    
    let currentPos: [number, number] = initialPos;
    const nodes: Antenna[] = [currentPos];

    while (true) {
        currentPos = [currentPos[0] + xDir, currentPos[1] + yDir];
        if (!isWithinBounds(currentPos, size)) {
            break;
        }
        nodes.push([currentPos[0], currentPos[1]]);
    }

    return nodes;
}

const getAllNodesInALine = (antenna1: Antenna, antenna2: Antenna, size: number): Antenna[] => {
    const alignedNodes = [antenna1, antenna2];

    const xDistance = Math.abs(antenna1[0] - antenna2[0]);
    const yDistance = Math.abs(antenna1[1] - antenna2[1]);
    if (antenna1[0] > antenna2[0]) {
        if (antenna1[1] > antenna2[1]) {
            alignedNodes.push(
                ...keepFillingUntilOutOfBounds([antenna1[0] + xDistance, antenna1[1] - yDistance], xDistance, -yDistance, size),
                ...keepFillingUntilOutOfBounds([antenna2[0] - xDistance, antenna2[1] + yDistance], -xDistance, yDistance, size)
            );
        } else {
            alignedNodes.push(
                ...keepFillingUntilOutOfBounds([antenna1[0] + xDistance, antenna1[1] - yDistance], xDistance, -yDistance, size),
                ...keepFillingUntilOutOfBounds([antenna2[0] - xDistance, antenna2[1] + yDistance], -xDistance, yDistance, size)
            );
        }
    } else {
        if (antenna1[1] > antenna2[1]) {
            alignedNodes.push(
                ...keepFillingUntilOutOfBounds([antenna1[0] - xDistance, antenna1[1] + yDistance], -xDistance, yDistance, size),
                ...keepFillingUntilOutOfBounds([antenna2[0] + xDistance, antenna2[1] - yDistance], xDistance, -yDistance, size)
            );
        } else {
            alignedNodes.push(
                ...keepFillingUntilOutOfBounds([antenna1[0] - xDistance, antenna1[1] - yDistance], -xDistance, -yDistance, size),
                ...keepFillingUntilOutOfBounds([antenna2[0] + xDistance, antenna2[1] + yDistance], xDistance, yDistance, size)
            );
        }
    }

    return alignedNodes;
};

export const getAntiNodesForAntennas = (antenna1: Antenna, antenna2: Antenna): [Antenna, Antenna] => {
    const xDistance = Math.abs(antenna1[0] - antenna2[0]);
    const yDistance = Math.abs(antenna1[1] - antenna2[1]);

    if (antenna1[0] > antenna2[0]) {
        if (antenna1[1] > antenna2[1]) {
            return [
                [antenna1[0] + xDistance, antenna1[1] + yDistance],
                [antenna2[0] - xDistance, antenna2[1] - yDistance]
            ]
        } else {
            return [
                [antenna1[0] + xDistance, antenna1[1] - yDistance],
                [antenna2[0] - xDistance, antenna2[1] + yDistance]
            ]
        }
    } else {
        if (antenna1[1] > antenna2[1]) {
            return [
                [antenna1[0] - xDistance, antenna1[1] + yDistance],
                [antenna2[0] + xDistance, antenna2[1] - yDistance]
            ];
        } else {
            return [
                [antenna1[0] - xDistance, antenna1[1] - yDistance],
                [antenna2[0] + xDistance, antenna2[1] + yDistance]
            ]; 
        }
    }
};

const getAntiNodesForMap = (map: AntennaMap, height: number, findAll: boolean = false): Antenna[] => {
    const antiNodes: Antenna[] = [];
    map.forEach((antennas: Antenna[], key: string) => {
        for (let i = 0; i < antennas.length; i++) {
            const antenna1 = antennas[i];
            for (let j = i + 1; j < antennas.length; j++) {
                const antenna2 = antennas[j];
                if (findAll) {
                    antiNodes.push(...getAllNodesInALine(antenna1, antenna2, height));
                } else {
                    antiNodes.push(...getAntiNodesForAntennas(antenna1, antenna2).filter((node) => isWithinBounds(node, height)));
                }
            }
        }
    });

    return antiNodes;
};


const dedupeNodes = (nodes: Antenna[]): Antenna[] => {
    const dedupedNodes = new Set<string>();
    nodes.forEach((node) => dedupedNodes.add(node.toString()));
    return Array.from(dedupedNodes).map((node) => {
        const [x, y] = node.split(',').map(Number);
        return [x, y];
    });
}

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(8, isExample);
    const { height, map } = parseFile(file);


    return dedupeNodes(getAntiNodesForMap(map, height)).length;
};


export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(8, isExample);
    const { height, map } = parseFile(file);

    const res =  dedupeNodes(getAntiNodesForMap(map, height, true));

    return res.length;
};
