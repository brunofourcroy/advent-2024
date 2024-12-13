import { readAdventOfCodeFile } from "../utils/readFile";

type Machine = {
    prize: [number, number];
    buttonA: [number, number];
    buttonB: [number, number];
}

const getMachines = (file: string, corrected = false): Machine[] => {
    return file.split('\n\n').map(part => {
        const [buttonAString, buttonBString, prizeString] = part.split('\n');
        const buttonA = buttonAString.split('Button A: ')[1].split(',').map(dirStr => Number(dirStr.split('+')[1])) as [number, number];
        const buttonB = buttonBString.split('Button B: ')[1].split(',').map(dirStr => Number(dirStr.split('+')[1])) as [number, number];
        const prize = prizeString.split(' ').reduce((acc: [number, number], p, i) => {
            if (i === 0) {
                return acc; 
            }
            if (i === 1) {
                acc[0] = Number(p.split('=')[1].replace(',', ''));
                if (corrected) {
                    acc[0] += 10000000000000;  
                }
            } else {
                acc[1] = Number(p.split('=')[1]);
                if (corrected) {
                    acc[1] += 10000000000000;  
                }
            }
            return acc;
        }, [0, 0]);
        return { buttonA, buttonB, prize };
    });
};


// 8400 = 94 * A + 22 * B
// 5400 = 34 * A + 67 * B

// 8400 - 94 * A = 22 * B
// (8400 - 94 * A) / 22 = B 
// 8400 / 22 - 94A/22 = B 

// 5400 = 34A + 67(8400 / 22 - 94A/22) 
// 34A + 67(8400 / 22 - 94A/22) = 5400 
// 34A + (67 * 8400 / 22) - ((67 * 94)A / 22) = 5400 
// (67 * 8400 / 22) - (((67 * 94) - 34 * 22)A / 22) = 5400 
// 67 * 8400 - ((67 * 94) - 34 * 22)A = 5400 * 22 
//  - ((67 * 94) - 34 * 22)A = 5400 * 22  - 67 * 8400
//  A = (5400 * 22  - 67 * 8400) / -((67 * 94) - 34 * 22)

const getOptimalPresses = (machines: Machine[]) => machines.reduce((acc, machine) => {
    const { prize, buttonA, buttonB } = machine;
    const APresses = (prize[1] *  buttonB[0] - buttonB[1] *  prize[0]) / - (buttonB[1] * buttonA[0] - buttonA[1] * buttonB[0]) 
    if (APresses % 1 !== 0) {
        return acc;
    }
    const BPresses = prize[0] / buttonB[0] - buttonA[0] * APresses / buttonB[0];
    return acc + APresses * 3 + BPresses;
}, 0);


export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(13, isExample);

    const machines = getMachines(file);

    return getOptimalPresses(machines);
};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(13, isExample);

    const machines = getMachines(file, true);

    return getOptimalPresses(machines);
};
