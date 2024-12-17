import { readAdventOfCodeFile } from "../utils/readFile";

const parseFile = (file: string) => {
    const [registerRows, programRow] = file.split('\n\n');
    const registers = registerRows.split('\n').reduce((registers: Record<string, number>, row) => {
        const [_, register, value] = row.split(' ');
        registers[register.replace(':', '')] = parseInt(value);
        return registers;
    }, {});
    const instructions = programRow.replace('Program: ', '').split(',').map(instruction => parseInt(instruction));
    return { A: registers.A, B: registers.B, C: registers.C, instructions };
}

const toComboOperand = (operand: number, A: number, B: number, C: number) => {
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
            return operand;
    }
}

const bitwiseXor = (a: number, b: number): number => {
    return a ^ b;
}

export const runProgram = (A: number, B: number, C: number, instructions: number[]): string => {
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
                A = Math.trunc(A / Math.pow(2, toComboOperand(operand, A, B, C)));
                break;
            case 1:
                B = bitwiseXor(B, operand);
                break;
            case 2:
                B = toComboOperand(operand, A, B, C) % 8;
                break;
            case 3:
                if (A === 0) {
                    break;
                }
                cur = operand;
                continue;
            case 4:
                B = bitwiseXor(B, C);
                break;
            case 5:
                outputs.push(toComboOperand(operand, A, B, C) % 8);
                break;
            case 6:
                B = A = Math.trunc(A / Math.pow(2, toComboOperand(operand, A, B, C)));
                break;
            case 7:
                C = A = Math.trunc(A / Math.pow(2, toComboOperand(operand, A, B, C)));
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
    return 0;
};
