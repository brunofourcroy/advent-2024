import { readAdventOfCodeFile } from "../utils/readFile";


const readFile = (file: string): { towels: string[], designs: string[] } => {
    const parts = file.split('\n\n');
    const towels = parts[0].split(', ');
    const designs = parts[1].split('\n');
    return { towels, designs };
}

const countCombinations = (design: string, towels: string[], cache: Map<string, number>): number => {
    if (cache.has(design)) {
        return cache.get(design)!;
    }
    if (!design) {
        return 1;
    }

    let count = 0;

    for (const towel of towels) {
        if (design.startsWith(towel)) {
            count += countCombinations(design.slice(towel.length), towels, cache);
        }
    }

    cache.set(design, count);
    return count;
}


const getPossibleDesigns = (towels: string[], designs: string[]): string[] => {
    const cache: Map<string, number> = new Map();
    
    return designs.filter(d => countCombinations(d, towels, cache) > 0);
}

const getWaysToMakeDesigns = (towels: string[], designs: string[]): number => {
    const cache: Map<string, number> = new Map();
    return designs.reduce((acc, design) => acc + countCombinations(design, towels, cache), 0);
}

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(19, isExample);
    const { towels, designs } = readFile(file);

    const possibleDesigns = getPossibleDesigns(towels, designs);

    return possibleDesigns.length;
};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(19, isExample);
    const { towels, designs } = readFile(file);

    const possibleDesigns = getPossibleDesigns(towels, designs);
    return getWaysToMakeDesigns(towels, possibleDesigns);
};
