// @ts-nocheck
import {PostgreSQL} from "../../../src/data-sources";
import {InputPagination, PaginatedData} from "../../../src/utils/pagination";

let sut: PostgreSQL;
let knex;
let knexClone;

beforeEach(() => {
    knexClone = {
        clearSelect: jest.fn().mockReturnThis(),
        count: jest.fn().mockReturnThis(),
        clearGroup: jest.fn().mockReturnThis(),
    };

    knex = {
        extend: jest.fn(),
        clone: jest.fn(() => knexClone),
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        clearSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        whereNotNull: jest.fn().mockReturnThis(),
        raw: jest.fn().mockReturnThis(),
        then: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        whereNull: jest.fn().mockReturnThis(),
        whereNotNull: jest.fn().mockReturnThis(),
    };
    jest.mock('knex', () => knex);

    sut = new PostgreSQL({
        client: 'pg',
        connection: {
            host: 'localhost',
            user: 'postgres',
            password: 'postgres',
            database: 'app'
        }
    });

    sut.knex = knex;
});

test('getAllRestaurants with given name', async () => {
    const name = 'name';
    const limit = 10;
    const pageCount = 1;

    knexClone.then = jest.fn(() => pageCount);
    knex.then = jest.fn(() => []);

    await sut
        .getAllRestaurants(name, undefined, new InputPagination({page: 1, limit: limit}))
        .then((result: PaginatedData) => {
            expect(knex.select).toHaveBeenCalledWith(
                'r.restaurant_uuid',
                'r.name',
                'c.country_code',
                'c.locales',
                knex.raw('ARRAY_AGG(rhi.image_uuid) as images')
            );
            expect(knex.where).toHaveBeenCalledWith('r.name', name);
            expect(knex.andWhere).not.toHaveBeenCalled();

            // Count assertions
            expect(result.pageInfo.total).toBe(pageCount);
            expect(knex.clone).toHaveBeenCalled();
            expect(knexClone.count).toHaveBeenCalledWith('* as count');
            expect(knexClone.clearSelect).toHaveBeenCalled()
            expect(knexClone.clearGroup).toHaveBeenCalled()

            // Pagination assertions
            expect(knex.limit).toHaveBeenCalledWith(limit);
            expect(knex.offset).toHaveBeenCalledWith(0);

            expect(result.data).toEqual([])
        });
});

test('getAllRestaurants with hasImage as true', async () => {
    const name = 'name';
    const limit = 10;
    const pageCount = 1;

    knexClone.then = jest.fn(() => pageCount);
    knex.then = jest.fn(() => []);

    await sut
        .getAllRestaurants(undefined, true)
        .then((result: PaginatedData) => {
            expect(knex.andWhere).toHaveBeenCalledWith("rhi.image_uuid", "IS NOT", null);
        });
});

test('getAllRestaurants with hasImage as false', async () => {
    const name = 'name';
    const limit = 10;
    const pageCount = 1;

    knexClone.then = jest.fn(() => pageCount);
    knex.then = jest.fn(() => []);

    await sut
        .getAllRestaurants(undefined, false)
        .then((result: PaginatedData) => {
            expect(knex.andWhere).toHaveBeenCalledWith("rhi.image_uuid", "IS", null);
        });
});