import {PostgreSQL} from "../../../src/data-sources";
import {InputPagination} from "../../../src/utils/pagination";

test.skip('getAllRestaurants queryBuilder', async () => {
    const sut = new PostgreSQL({
        client: 'pg',
        connection: {
            host: 'postgres',
            user: 'postgres',
            password: 'postgres',
            database: 'thefork'
        }
    });
    // @ts-ignore
    sut.knex = jest.fn(() => {
        return {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            clone: jest.fn().mockReturnThis(),
            clearSelect: jest.fn().mockReturnThis(),
            countDistinct: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            whereNotNull: jest.fn().mockReturnThis(),
            raw: jest.fn().mockReturnThis(),
            then: jest.fn().mockReturnThis(),
        }
    });

    sut.getAllRestaurants('name', true, new InputPagination({page: 1, limit: 10}));
});