import {MapProvider} from "../../src/utils/providers";

test('MapProvider', () => {
    const map = new Map();
    map.set('key1', 'value1')
    map.set('key2', 'value2')
    const provider = new MapProvider(map);

    expect(provider.has('key1')).toBeTruthy();
    expect(provider.has('key2')).toBeTruthy();
    expect(provider.has('key3')).toBeFalsy();
    expect(provider.get('key1')).toBe('value1');
    expect(provider.get('key2')).toBe('value2');
    expect(provider.get('key3')).toBeUndefined();
})