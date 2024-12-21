import { readAdventOfCodeFile } from "../utils/readFile";

type NumericCommand = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | 'A';
type Command = '>' | '<' | '^' | 'v' | 'A';
type Position = { row: number; col: number };


type Pad<T extends string | number | symbol> = {
    paths: Record<T, Record<T, Command[]>>;
}

// +---+---+---+
// | 7 | 8 | 9 |
// +---+---+---+
// | 4 | 5 | 6 |
// +---+---+---+
// | 1 | 2 | 3 |
// +---+---+---+
//     | 0 | A |
//     +---+---+

const numbericPad: Pad<NumericCommand> = {
    paths: {
        0: {
            0: [],
            1: ['^', '<'],
            2: ['^'],
            3: ['>', '^'],
            4: ['^', '^', '<'],
            5: ['^', '^'],
            6: ['>', '^', '^'],
            7: ['^', '^', '^', '<'],
            8: ['^', '^', '^'],
            9: ['^', '^', '^', '>'],
            A: ['>'],
        },
        1: {
            0: ['>', 'v'],
            1: [],
            2: ['>'],
            3: ['>', '>'],
            4: ['^'],
            5: ['^', '>'], // Could be > ^ ?
            6: ['>', '>', '^'],
            7: ['^', '^'],
            8: ['^', '^', '>'],
            9: ['^', '^', '>', '>'],
            A: ['>', '>', 'v'],
        },
        2: {
            0: ['v'],
            1: ['<'],
            2: [],
            3: ['>'],
            4: ['<', '^'],
            5: ['^'],
            6: ['>', '^'],
            7: ['<', '^', '^'],
            8: ['^', '^'],
            9: ['>', '^', '^'],
            A: ['v', '>'],
        },
        3: {
            0: ['<', 'v'],
            1: ['<', '<'],
            2: ['<'],
            3: [],
            4: ['<', '<', '^'],
            5: ['<', '^'], // Could be ^ <
            6: ['^'],
            7: ['<', '<', '^', '^'],
            8: ['^', '^', '<'],
            9: ['^', '^'],
            A: ['v'],
        },
        4: {
            0: ['>', 'v', 'v'],
            1: ['v'],
            2: ['v', '>'], // Could be > v ?
            3: ['>', '>', 'v'],
            4: [],
            5: ['>'],
            6: ['>', '>'],
            7: ['^'],
            8: ['^', '>'],
            9: ['^', '>', '>'],
            A: ['>', '>', 'v', 'v'],
        },
        5: {
            0: ['v', 'v'],
            1: ['<', 'v'],
            2: ['v'],
            3: ['>', 'v'],
            4: ['<'],
            5: [],
            6: ['>'],
            7: ['<', '^'],
            8: ['^'],
            9: ['^', '>'],
            A: ['v', 'v', '>'],
        },
        6: {
            0: ['<', 'v', 'v'],
            1: ['<', '<', 'v'],
            2: ['<', 'v'], // Could be v < ? 
            3: ['v'],
            4: ['<', '<'],
            5: ['<'],
            6: [],
            7: ['<', '<', '^'],
            8: ['^', '<'],
            9: ['^'],
            A: ['v', 'v'],
        },
        7: {
            0: ['>', 'v', 'v', 'v'],
            1: ['v', 'v'],
            2: ['v', 'v', '>'], // Could be > v v ?
            3: ['>', '>', 'v', 'v'],
            4: ['v'],
            5: ['v', '>'], // Could be > v ?
            6: ['>', '>', 'v'],
            7: [],
            8: ['>'],
            9: ['>', '>'],
            A: ['>', '>', 'v', 'v', 'v'],
        },
        8: {
            0: ['v', 'v', 'v'],
            1: ['<', 'v', 'v'],
            2: ['v', 'v'],
            3: ['>', 'v', 'v'],
            4: ['<', 'v'],
            5: ['v'],
            6: ['>', 'v'],
            7: ['<'],
            8: [],
            9: ['>'],
            A: ['v', 'v', 'v', '>'],
        },
        9: {
            0: ['<', 'v', 'v', 'v'],
            1: ['<', '<', 'v', 'v'],
            2: ['<', 'v', 'v'], // Could be v v < ?
            3: ['v', 'v'],
            4: ['<', '<', 'v'],
            5: ['<', 'v'], // Could be v < ?
            6: ['v'],
            7: ['<', '<'],
            8: ['<'],
            9: [],
            A: ['v', 'v', 'v'],
        },
        A: {
            0: ['<'],
            1: ['^', '<', '<'],
            2: ['<', '^'], // Could be  ^ < ?
            3: ['^'],
            4: ['^', '^', '<', '<'],
            5: ['<', '^', '^'], // Could be ^ ^ < ?
            6: ['^', '^'],
            7: ['^', '^', '^', '<', '<'],
            8: ['<', '^', '^', '^'],
            9: ['^', '^', '^'],
            A: [],
        },
    }
};

//     +---+---+
//     | ^ | A |
// +---+---+---+
// | < | v | > |
// +---+---+---+

const directionalPad: Pad<Command> = {
    paths: {
        '^': {
            'A': ['>'],
            '>': ['>', 'v'],
            'v': ['v'],
            '<': ['v', '<'],
            '^': []
        },
        '<': {
            'v': ['>'],
            '>': ['>', '>'],
            '^': ['>', '^'],
            'A': ['>', '>', '^'],
            '<': []
        },
        'v': {
            '<': ['<'],
            '>': ['>'],
            '^': ['^'],
            'A': ['>', '^'],
            'v': []
        },
        '>': {
            '<': ['<', '<'],
            'v': ['<'],
            '^': ['^', '<'],
            'A': ['^'],
            '>': []
        },
        'A': {
            '<': ['v', '<', '<'],
            'v': ['v', '<'],
            '^': ['<'],
            '>': ['v'],
            A: []
        }
    }
};

const padMove = <T extends string | number | symbol>(from: T, to: T, pad: Pad<T>): Command[] => {
    const { paths } = pad;
    
    return paths[from][to];
}

const inputCache: Map<string, Command[]> = new Map();

const getInputForOutput = (from: Command, to: Command[]): Command[] => {
    const cached = inputCache.get(`${from}-${to.join('')}`);
    if (cached) {
        return cached;
    }
    if (to.length === 1) {
        const move: Command[] = [...padMove(from, to[0], directionalPad), 'A'];
        inputCache.set(`${from}-${to.join('')}`, move);
        return move;
    }

    const firstHalf = to.slice(0, Math.ceil(to.length / 2));
    const secondHalf = to.slice(Math.ceil(to.length / 2));

    const inputForFirstHalf = getInputForOutput(from, firstHalf);

    const whereAreWeNow = firstHalf[firstHalf.length - 1];

    const inputForSecondHalf: Command[] = getInputForOutput(whereAreWeNow, secondHalf);
    inputCache.set(`${from}-${to.join('')}`, [...inputForFirstHalf, ...inputForSecondHalf]);
    //console.log(`Cached entry count: ${inputCache.size}`);

    return [...inputForFirstHalf, ...inputForSecondHalf];
}

export const getInputForFinalOutput = (desiredOutput: string[], nbOfRobotsWithDirectionalPads: number) => {
    const chain: { cur: Command | NumericCommand; path: Command[] }[] = [
        { cur: 'A', path: [] },
    ];
    for (let i = 0; i < nbOfRobotsWithDirectionalPads; i++) {
        chain.push({ cur: 'A', path: []})
    }

    for (let i = 0; i< chain.length; i++) {
        // First we work out the sequence on the num pad
        if (i === 0) {
            for (let char of desiredOutput) {
                const commands = padMove(chain[i].cur as NumericCommand, char as NumericCommand, numbericPad);
                chain[i].path = [...chain[i].path, ...commands, 'A'];
                chain[i].cur = char as NumericCommand;
            }
        } else {
            // For the rest, we use the dir pad
            let toProcess = chain[i - 1].path;
            chain[i].path = getInputForOutput(chain[i].cur as Command, toProcess);
        }
    }
    return chain[chain.length - 1].path;
};

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(21, isExample);
    const desiredOutputs: string[][] = file.split('\n').map(line => line.split(''));
    const finalInputs: string[][] = [];
    for (const desiredOutput of desiredOutputs) {
        finalInputs.push(getInputForFinalOutput(desiredOutput, 2));
    }
    
    return finalInputs.reduce((acc, input, i) => {
        desiredOutputs[i].splice(desiredOutputs[i].length - 1);
        const score = input.length * Number(desiredOutputs[i].join(''));
        return acc + score;
    }, 0);
};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(21, isExample);
    const desiredOutputs: string[][] = file.split('\n').map(line => line.split(''));
    const finalInputs: string[][] = [];

    let inputProcessed = 0;
    for (const desiredOutput of desiredOutputs) {
        finalInputs.push(getInputForFinalOutput(desiredOutput, 25));
        inputProcessed += 1;

        console.log(`Processed ${inputProcessed} / ${desiredOutputs.length} inputs`)
    }
    
    return finalInputs.reduce((acc, input, i) => {
        desiredOutputs[i].splice(desiredOutputs[i].length - 1);
        const score = input.length * Number(desiredOutputs[i].join(''));
        return acc + score;
    }, 0);
};
