import RestaurantRowToModelFactory from "../../../../../src/models/factories/restaurant/restaurantModelFactory";
import {MapProvider} from "../../../../../src/utils/providers";

test('restaurantModelFactory', () => {
    const row = {
        restaurant_uuid: 'restaurant_uuid',
        name: 'name',
        country_code: 'FR',
        locales: ['locales'],
        images: ['image1', 'image2'],
    }
    const map = new Map();
    map.set('image1', 'http://image1');
    map.set('image2', 'http://image2');
    const imagesProvider = new MapProvider(map)
    const result = RestaurantRowToModelFactory.create(row, imagesProvider);

    expect(result.restaurantUuid).toBe('restaurant_uuid');
    expect(result.name).toBe('name');
    expect(result.country.code).toBe('FR');
    expect(result.country.locales).toEqual(['locales']);
    expect(result.images).toEqual(['http://image1', 'http://image2']);
    expect(result.allowReviews).toBe(true);
});