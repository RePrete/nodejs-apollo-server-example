export interface DataProviderInterface {
    has(x: string): boolean;
    get(x: string): string;
}

export class MapProvider implements DataProviderInterface {
    private map: Map<string, string>;

    constructor(map: Map<string, string>) {
        this.map = map;
    }

    has(x: string): boolean {
        return this.map.has(x);
    }

    get(x: string): string {
        const result = this.map.get(x);
        if (result === undefined) {
            throw new Error(`${x} not found`);
        }
        return result;
    }
}