import { SQLDataSource } from 'datasource-sql';
import { InputPagination, PageInfo, PaginatedData } from '../utils/pagination';

export default class PostgreSQL extends SQLDataSource {
    // This should only accept a queryBuilder, but I cannot find the definition implementing the clone method
    private async countTotalRows(query: any) {
        return query
            .clone()
            .clearSelect()
            .clearGroup()
            .count("* as count")
            .then((count: any) => count[0].count);
    }

    private addPagination(query: any, pagination: InputPagination) {
        return query
            .limit(pagination.limit)
            .offset(pagination.offset)
    }

    private async getPageInfo(query: any, inputPagination: InputPagination): Promise<PageInfo> {
        const count = await this.countTotalRows(query);
        return new PageInfo(count, inputPagination.limit, inputPagination.page);
    }

    async getAllRestaurants(
        name: string,
        hasImage: boolean,
        inputPagination: InputPagination = new InputPagination({page: 1, limit: 10})
    ): Promise<PaginatedData> {
        const relevantFields = ["r.restaurant_uuid", "r.name", "c.country_code", "c.locales"]
        const query = this.knex
            .select(
                ...relevantFields, 
                this.knex.raw('ARRAY_AGG(rhi.image_uuid) as images')
            )
            .from("restaurant AS r")
            .leftJoin("restaurant_has_image AS rhi", "r.restaurant_uuid", "rhi.restaurant_uuid")
            .leftJoin("country AS c", "r.country_code", "c.country_code")
            .groupBy(...relevantFields)

        if (name) {
            query.where("r.name", name);
        }
        if (hasImage !== undefined) {
            if (hasImage) {
                query.andWhere("rhi.image_uuid", "IS NOT", null);
            } else {
                query.andWhere("rhi.image_uuid", "IS", null);
            }
        }

        const pageInfo = await this.getPageInfo(query, inputPagination);
        const rows = await this
            .addPagination(query, inputPagination)
            .then((rows: any[]) => rows)
        return new PaginatedData(rows, pageInfo);
    }
}