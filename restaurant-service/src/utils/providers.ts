export interface DataProviderInterface {
    has(x: string): boolean;
    get(x: string): string | undefined;
}

export class MapProvider implements DataProviderInterface {
    private map: Map<string, string>;

    constructor(map: Map<string, string>) {
        this.map = map;
    }

    has(x: string): boolean {
        return this.map.has(x);
    }

    get(x: string): string | undefined{
        return this.map.get(x);
    }
}