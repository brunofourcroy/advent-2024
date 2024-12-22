import { readAdventOfCodeFile } from "../utils/readFile";

const secretCache: Map<bigint, bigint> = new Map<bigint, bigint>();

const generateSecret = (secret: bigint): bigint => {
    const cached = secretCache.get(secret); 
    if (cached) {
        return cached;
    }
    let newSecret = secret;
    newSecret = ((newSecret * 64n) ^ newSecret) % 16777216n;
    newSecret = ((newSecret / 32n) ^ newSecret) % 16777216n;
    newSecret = ((newSecret * 2048n) ^ newSecret) % 16777216n;

    secretCache.set(secret, newSecret);

    return newSecret;
};

const generateSecretNTimes = (secret: number, iterations: number): bigint => {
    let newSecret = BigInt(secret);
    for (let i = 0; i < iterations; i += 1) {
        newSecret =  generateSecret(newSecret);
    }
    return newSecret;
};

export const solveStep1 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(22, isExample);
    const secrets = file.split('\n').map(Number);
    
    return secrets.reduce((acc, secret) => Number(generateSecretNTimes(secret, 2000)) + acc, 0);
};

const getPriceChanges = (secret: bigint, n: number): [number[], number[]] => {
    let previous = secret;
    const prices: number[] = [];
    const deltas: number[] = [];

    for (let i = 0; i < n; i += 1) {
        const nextSecretNumber = generateSecret(previous);
        const nextPrice = Number(nextSecretNumber % 10n);
        const prevPrice = Number(previous % 10n);
        prices.push(nextPrice);
        deltas.push(nextPrice - prevPrice);
        previous = nextSecretNumber;
    }

    return [prices, deltas];
}; 

const findSequences = (prices: number[], deltas: number[]): Record<string, number> => {
    const sequences: Record<string, number> = {};

    for (let i = 3; i < deltas.length; i++) {
        const seq = [
            deltas[i - 3],
            deltas[i - 2],
            deltas[i - 1],
            deltas[i]
        ];
        
        const seqKey = seq.join(',');
        
        if (!(seqKey in sequences)) {
            sequences[seqKey] = prices[i];
        }
    }

    return sequences;
}

const BananaCounts: Record<string, number> = {};

export const solveStep2 = async (isExample: boolean): Promise<number> => {
    const file = await readAdventOfCodeFile(22, isExample);
    // Example is different from part 1, rude
    const secrets = isExample ? [
        1,
        2,
        3,
        2024
    ] : file.split('\n').map(Number);

    for (let i = 0; i < secrets.length; i++) {
        const [prices, deltas] = getPriceChanges(BigInt(secrets[i]), 2000);
        const sequences = findSequences(prices, deltas);
        for (const [key, value] of Object.entries(sequences)) {
            if (key in BananaCounts) {
                BananaCounts[key] += value;
            } else {
                BananaCounts[key] = value;
            }
        }
    }
    return Math.max(...Object.values(BananaCounts));
};
