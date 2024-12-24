import { readAdventOfCodeFile } from "../utils/readFile";

enum Operation {
    OR = 'OR',
    AND = 'AND',
    XOR = 'XOR'
};

type Inputs = Map<string, boolean>;
type Gate = {
    operation: Operation;
    input1: string;
    input2: string;
    output: string;
};

const parseFile = (file: string): { inputs: Inputs, gates: Gate[], inputCounts: number} => {
    const inputSet = new Set<string>();

    const [rawInputs, rawGates] = file.split('\n\n');
    const inputs = rawInputs.split('\n').reduce((acc, line) => {
        const [key, value] = line.split(': ');
        acc.set(key, value === '1');

        inputSet.add(key);

        return acc;
    }, new Map<string, boolean>());
    const gates = rawGates.split('\n').map(line => {
        const [rawOperation, output] = line.split(' -> ');
        const [input1, operation, input2] = rawOperation.split(' ');

        inputSet.add(input1);
        inputSet.add(input2);
        inputSet.add(output);

        return {
            operation: operation as Operation,
            input1,
            input2,
            output,
        };
    });

    return { inputs, gates, inputCounts: inputSet.size };
};

const solveOutput = (input1: boolean, input2: boolean, operation: Operation): boolean => {
    switch (operation) {
        case Operation.OR: return input1 || input2;
        case Operation.AND: return input1 && input2;
        case Operation.XOR: return input1 !== input2;
        default:
            throw new Error(`Unknown operation: ${operation}`);
    }
};

const fillInputs = (inputs: Inputs, gates: Gate[], inputCounts: number): Inputs=> {
    let solvedInputs = inputs.size;
    const newInputs = new Map<string, boolean>();
    for (const input of inputs.entries()) {
        newInputs.set(input[0], input[1]);
    }

    while (solvedInputs !== inputCounts) {
        for (const gate of gates) {
            if (newInputs.has(gate.output)) continue;

            const input1 = newInputs.get(gate.input1);
            const input2 = newInputs.get(gate.input2);

            if (input1 !== undefined && input2 !== undefined) {
                newInputs.set(gate.output, solveOutput(input1, input2, gate.operation));
                solvedInputs++;
            }
        }
    }

    return newInputs;
}

const getBinaryOutput = (inputs: Inputs, key: string): string => {
    let outputNb = 0;
    let binaryOutput = '';

    while (true) {
        const output = inputs.get(`${key}${outputNb.toString().padStart(2, '0')}`)

        if (output === undefined) {
            break;
        }

        binaryOutput = `${output ? '1' : '0'}${binaryOutput}`;
        outputNb++;
    }

    return binaryOutput;
}

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(24, isExample);
    const { inputs, gates, inputCounts } = parseFile(file);

    const filled = fillInputs(inputs, gates, inputCounts);

    return parseInt(getBinaryOutput(filled, 'z'), 2);
};

const findOutputsForGate = (gate: Gate, gates: Gate[]): string[] => {
    if (gate.output.startsWith('z')) {
        return [gate.output];
    }

    const outputs: string[] = [];
    const nextGates = gates.filter(g => g.input1 === gate.output || g.input2 === gate.output);

    nextGates.forEach(gate => {
        outputs.push(...findOutputsForGate(gate, gates));
    })

    return outputs;
}

const isFirstGate = (gate: Gate): boolean => gate.input1 === 'x00' || gate.input2 === 'x00';
const isEntryGate = (gate: Gate): boolean => gate.input1.startsWith('x') || gate.input2.startsWith('x');
const leadsToFirstOutput = (gate: Gate): boolean => gate.output === 'z00';
const leadsToOutput = (gate: Gate): boolean => gate.output.startsWith('z');
const isLastOutput = (gate: Gate): boolean => gate.output === 'z45';
const hasInput = (gate: Gate, input: string) => gate.input1 === input || gate.input2 === input;
const hasOutput = (gate: Gate, output: string) => gate.output === output;

export const solveStep2 = async (isExample: boolean): Promise<string> => {
    const file = await readAdventOfCodeFile(24, isExample);

    const { gates } = parseFile(file);

    const badGates: Set<string> = new Set();

    const DirectXORGates = gates.filter(isEntryGate).filter(g => g.operation === Operation.XOR);

    // Only x00/y00 should lead to z00
    for (const gate of DirectXORGates) {
        if (isFirstGate(gate)) {
            if (!leadsToFirstOutput(gate)) {
                badGates.add(gate.output);
            }
        } else if (leadsToFirstOutput(gate)) {
            badGates.add(gate.output);
        } else if (leadsToOutput(gate)) {
            badGates.add(gate.output);
        }
    } 

    const indirectXORGates = gates.filter(gate => gate.operation === Operation.XOR).filter(gate => !isEntryGate(gate));

    // The other XORs should only be used in the outputs
    for (const gate of indirectXORGates) {
        if (!leadsToOutput(gate)) {
            badGates.add(gate.output);
        }
    }

    const outputGates = gates.filter(g => leadsToOutput(g));

    for (const gate of outputGates) {
        // The last output should be OR
        if (isLastOutput(gate))  {
            if (gate.operation !== Operation.OR) {
                badGates.add(gate.output);
            }
        // Everything else a XOR
        } else if (gate.operation !== Operation.XOR) {
            badGates.add(gate.output);
        }
    }

    // XOR inputs should lead to outputs
    const toFix: Gate[] = [];
    for (const gate of DirectXORGates) {
        const outputs = indirectXORGates.filter(g => hasInput(g, gate.output));

        if (!leadsToFirstOutput(gate) && outputs.length === 0) {
            toFix.push(gate)
            badGates.add(gate.output);
        }
    }

    // We expect one of them does not, so we need to find its pair
    for (const gate of toFix) {
        const expectedOutput = `z${gate.input1.slice(1)}`;
        const matches = indirectXORGates.filter(g => hasOutput(g, expectedOutput));

        if (matches.length !== 1) {
            throw new Error('We should have found one match');
        }

        const match = matches[0];

        const toCheck = [match.input1, match.input2];

        const orMatches = gates.filter(g => g.operation === Operation.OR).filter((gate) => toCheck.includes(gate.output));

        if (orMatches.length !== 1) {
            throw new Error('We should have found one match');
        }

        const orMatch = orMatches[0];

        const broken = toCheck.find(i => i !== orMatch.output);

        if (broken === undefined) {
            throw new Error('Not possible');
        }

        badGates.add(broken);
    }

    if (badGates.size !== 8) {
        throw new Error('Christmas is ruined');
    }

    // Outputs the set alphabetically, comma-separated
    return Array.from(badGates).sort().join(',');
};
