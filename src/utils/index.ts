import { AssetNameLabel } from '../types';

export const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const toLovelace = (adaAmount: number): number => adaAmount * 1000000;

export const toADA = (lovelaceAmount: number): number => lovelaceAmount / 1000000;

export const chunk = <T>(input: T[], size: number) => {
    return input.reduce<T[][]>((arr: T[][], item: T, idx: number) => {
        return idx % size === 0 ? [...arr, [item]] : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
    }, []);
};

export const awaitForEach = async <T>(array: T[], callback: (item: T, index: number, array: T[]) => Promise<void>) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

// Used to execute Promises in order, but still async.
// Good for adding delay between API calls and you need the complete list of results when they all resolve
export const asyncForEach = async <T, U>(
    array: T[],
    callback: (item: T, index: number, array: T[]) => Promise<U>,
    delayInMilliseconds = 0
) => {
    const promises: Promise<U>[] = [];
    for (let index = 0; index < array.length; index++) {
        promises.push(callback(array[index], index, array));
        if (delayInMilliseconds > 0) {
            await delay(delayInMilliseconds);
        }
    }
    return Promise.all(promises);
};

export const isNumeric = (n: string) => {
    return !isNaN(parseFloat(n)) && isFinite(parseFloat(n));
};

export const isNullEmptyOrUndefined = (value: any) => {
    return (
        value == undefined ||
        value == null ||
        value == '' ||
        JSON.stringify(value) === '{}' ||
        JSON.stringify(value) === '[]'
    );
};

export const isAlphaNumeric = (str: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(str);
};

export const getDateFromSlot = (currentSlot: number, network?: string): number => {
    // TODO: Make this work for all networks
    //console.log(`preview slot date = ${new Date(currentSlot * 1000)}`)
    const currentNetwork = network ? network.toLowerCase() : process.env.NETWORK?.toLowerCase();
    if (currentNetwork == 'preview') return (1666656000 + currentSlot) * 1000;
    if (currentNetwork == 'preprod') return (1654041600 + currentSlot) * 1000;

    return (1596491091 + (currentSlot - 4924800)) * 1000;
};

export const getSlotNumberFromDate = (date: Date, network?: string): number => {
    const currentNetwork = network ? network.toLowerCase() : process.env.NETWORK?.toLowerCase();
    if (currentNetwork == 'preview') return Math.floor(date.getTime() / 1000) - 1666656000;
    if (currentNetwork == 'preprod') return Math.floor(date.getTime() / 1000) - 1654041600;

    // Ignore parens to show intent
    // prettier-ignore
    return (Math.floor(date.getTime() / 1000) - 1596491091) + 4924800;
};

export const parseAssetNameLabel = (assetName: string): AssetNameLabel | null => {
    for(const lbl in AssetNameLabel) {
        if (assetName.startsWith(AssetNameLabel[lbl as keyof typeof AssetNameLabel])) {
            return lbl as AssetNameLabel;
        }
    }
    return null;
}

export { DefaultTextFormat as KeyType, encodeJsonToDatum, decodeCborToJson } from './cbor';

export * from './crypto';
