import { readAdventOfCodeFile } from "../utils/readFile";

const parseFile = (file: string) => {
    const [registerRows, programRow] = file.split('\n\n');
    const registers = registerRows.split('\n').reduce((registers: Record<string, number>, row) => {
        const [_, register, value] = row.split(' ');
        registers[register.replace(':', '')] = parseInt(value);
        return registers;
    }, {});
    const instructions = programRow.replace('Program: ', '').split(',').map(instruction => parseInt(instruction));
    return { A: BigInt(registers.A), B: BigInt(registers.B), C: BigInt(registers.C), instructions };
}

const toComboOperand = (operand: number, A: bigint, B: bigint, C: bigint): bigint => {
    switch (operand) {
        case 4:
            return A;
        case 5:
            return B;
        case 6:
            return C;
        case 7:
            throw new Error('Invalid operand');
        default:
            return BigInt(operand);
    }
}

const bitwiseXor = (a: bigint, b: bigint): bigint => {
    return a ^ b;
}

export const runProgram = (A: bigint, B: bigint, C: bigint, instructions: number[]): string => {
    const outputs: number[] = [];

    let cur = 0;
    while (true) {
        const instruction = instructions[cur];
        const operand = instructions[cur + 1];
        if (typeof instruction === 'undefined') {
            break;
        }
        switch (instruction) {
            case 0:
                A = BigInt(Math.trunc(Number(A) / Math.pow(2, Number(toComboOperand(operand, A, B, C)))));
                break;
            case 1:
                B = bitwiseXor(B, BigInt(operand));
                break;
            case 2:
                B = toComboOperand(operand, A, B, C) % 8n;
                break;
            case 3:
                if (A === 0n) {
                    break;
                }
                cur = operand;
                continue;
            case 4:
                B = bitwiseXor(B, C);
                break;
            case 5:
                outputs.push(Number(toComboOperand(operand, A, B, C) % 8n));
                break;
            case 6:
                B  = BigInt(Math.trunc(Number(A) / Math.pow(2, Number(toComboOperand(operand, A, B, C)))));
                break;
            case 7:
                C = BigInt(Math.trunc(Number(A) / Math.pow(2, Number(toComboOperand(operand, A, B, C)))));
                break;
        }
        cur += 2;
    }

    return outputs.join(',');
}


export const solveStep1 = async (isExample: boolean): Promise<string> => {
    const file = await readAdventOfCodeFile(17, isExample);
    let { A, B, C, instructions } = parseFile(file);
    
    return runProgram(A, B, C, instructions);
};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(17, isExample);
    let { B, C, instructions } = parseFile(file);

    const desiredOutput = instructions.join(',');
    let possibleA = 0n;
    let loopCount = 0;
    while (true) {
        const output = runProgram(possibleA, B, C, instructions);
        if (output === desiredOutput) {
            break;
        }
        if (possibleA !== 0n && desiredOutput.endsWith(output)) {
            possibleA *= 8n;
        } else {
            possibleA += 1n;
        }
        loopCount++;
    }
    console.log(`Loop count: ${loopCount}`);
    return Number(possibleA);
};
