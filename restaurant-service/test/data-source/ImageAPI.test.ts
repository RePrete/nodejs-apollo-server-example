import {ImageAPI} from "../../src/data-sources";

test('getImmages return results from external service, extracting data from body.images', async () => {
    const sut = new ImageAPI('http://image.com');
    const externalImages = [{imageUuid: '1', url: 'http://image.com'}];
    // @ts-ignore
    sut.get = jest.fn(() => Promise.resolve({
        body: Promise.resolve({
            images: externalImages
        })
    }));
    const result = await sut.getImages();
    expect(result).toHaveLength(1);
    expect(result).toEqual(externalImages);
});