import { readAdventOfCodeFile } from "../utils/readFile";

type Connection = [string, string];
type Trio = [string, string, string];
type Neighbours = Map<string, Set<string>>;

const parseFile = (file: string): Connection[] => {
    return file.split('\n').map(row => {
        const nodes = row.split('-');

        return [nodes[0], nodes[1]];
    });
}

const intersection = <T>(set1: Set<T>, set2: Set<T>): Set<T> => {
    return new Set([...set1].filter(x => set2.has(x)));
}

const findTriosWithPrefix = (connections: Connection[], prefix: string): Trio[] => {
    const uniqueTrios: Set<string> = new Set();
    const neighbourSets = getNeighbours(connections);
    for (const connection of connections) {
        for (const node of connection) {
            if (node.startsWith(prefix)) {
                const commonNeighbours = intersection(
                    neighbourSets.get(connection[0]) || new Set(),
                    neighbourSets.get(connection[1]) || new Set()
                );
                
                for (const thirdNode of commonNeighbours) {
                    uniqueTrios.add([...connection, thirdNode].sort().join('-'));
                }
            }
        }
    }

    return [...uniqueTrios].map(trio => trio.split('-') as Trio);
}

const findLargestNetwork = (allNeighbours: Neighbours, network: string[], nodes: Set<string>): string[] => {
    if (nodes.size === 0) {
        return network;
    }
    
    const largestNetworks: string[][] = [];

    for (const node of nodes) {
        const newNetwork = [...network, node];
        const neighbours = allNeighbours.get(node) || new Set();
        // Only searching alphabetically
        const newCandidates = new Set([...intersection(nodes, neighbours)].filter(n => n > node));
        largestNetworks.push(findLargestNetwork(allNeighbours, newNetwork, newCandidates));
    }
    
    return largestNetworks.reduce((acc, network) => network.length > acc.length ? network : acc, []);
}

const getNeighbours = (connections: Connection[]): Neighbours => {
    const neighbours: Neighbours = new Map();
    
    for (const [node1, node2] of connections) {
        const node1Neighbours = neighbours.get(node1);
        if (!node1Neighbours) {
            const set: Set<string> = new Set();
            set.add(node2);
            neighbours.set(node1, set);
        } else {
            node1Neighbours.add(node2);
        }

        const node2Neighbours = neighbours.get(node2);
        if (!node2Neighbours) {
            const set: Set<string> = new Set();
            set.add(node1);
            neighbours.set(node2, set);
        } else {
            node2Neighbours.add(node1);
        }
    }
    
    return neighbours;
}

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(23, isExample);
    const connections = parseFile(file);
    return new Set(findTriosWithPrefix(connections, "t")).size;
};

export const solveStep2 = async (isExample: boolean): Promise<string> => {
    const file = await readAdventOfCodeFile(23, isExample);
    const connections = parseFile(file);

    const neighbourSets = getNeighbours(connections);

    return findLargestNetwork(neighbourSets, [], new Set(neighbourSets.keys())).join(",");
};
