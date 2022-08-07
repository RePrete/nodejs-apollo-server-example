import {resolvers as restaurantResolvers} from '../../../src/graph-definitions/restaurant';
import {InputPagination, PageInfo, PaginatedData} from "../../../src/utils/pagination";

test('Query restaurants exists', () => {
    expect(restaurantResolvers.Query.restaurants).toBeDefined();
});

test('Query restaurants returns a PaginatedRestaurants', async () => {
    const images = [{imageUuid: '1', url: 'http://image.com'}];
    const context = {
        dataSources: {
            pg: {
                getAllRestaurants: jest.fn(() => Promise.resolve(
                    new PaginatedData(
                        [
                            {
                                restaurant_uuid: '1',
                                name: 'Restaurant 1',
                                country_code: 'FR',
                                locales: ['fr', 'en'],
                                images: ['1'],
                            },
                            {
                                restaurant_uuid: '2',
                                name: 'Restaurant 2',
                                country_code: 'IT',
                                locales: ['it'],
                                images: [],
                            }
                        ],
                        new PageInfo(2, 1, 1)
                    )
                ))
            },
            imageAPI: {
                getImages: jest.fn(() => Promise.resolve(images))
            }
        }
    };
    const args = {
        pagination: {
            limit: 10,
            page: 1
        },
        name: '',
        hasImage: false
    };
    const result = await restaurantResolvers.Query.restaurants({}, args, context, {});

    expect(context.dataSources.pg.getAllRestaurants.mock.calls[0]).toEqual([
        args.name,
        args.hasImage,
        new InputPagination(args.pagination)
    ]);

    expect(result.restaurants).toHaveLength(2);

    expect(result.restaurants[0].restaurantUuid).toEqual('1');
    expect(result.restaurants[0].name).toEqual('Restaurant 1');
    expect(result.restaurants[0].country.code).toEqual('FR');
    expect(result.restaurants[0].country.locales).toEqual(['fr', 'en']);
    expect(result.restaurants[0].images).toEqual(['http://image.com']);
    expect(result.restaurants[0].allowReviews).toEqual(true);

    expect(result.restaurants[1].restaurantUuid).toEqual('2');
    expect(result.restaurants[1].name).toEqual('Restaurant 2');
    expect(result.restaurants[1].country.code).toEqual('IT');
    expect(result.restaurants[1].country.locales).toEqual(['it']);
    expect(result.restaurants[1].images).toHaveLength(0);
    expect(result.restaurants[1].allowReviews).toEqual(false);

    expect(result.pagination.total).toEqual(2);
    expect(result.pagination.pageCount).toEqual(1);
    expect(result.pagination.currentPage).toEqual(1);
});