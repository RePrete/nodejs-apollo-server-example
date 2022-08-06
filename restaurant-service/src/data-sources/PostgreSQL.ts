import { SQLDataSource } from 'datasource-sql';
import { InputPagination, PageInfo, PaginatedData } from '../utils/pagination';
export default class PostgreSQL extends SQLDataSource {
    // This should only accept a queryBuilder, but I cannot find the definition implementing the clone method
    private async count(query: any) {
        return query
            .clone()
            .clearSelect()
            .countDistinct("r.restaurant_uuid as count")
            .then((count: any) => count[0].count);
    }

    private addPagination(query: any, pagination: InputPagination) {
        return query
            .limit(pagination.limit)
            .offset(pagination.offset)
    }

    private async getPageInfo(query: any, inputPagination: InputPagination): Promise<PageInfo> {
        const count = await this.count(query);
        return new PageInfo(count, Math.ceil(count / inputPagination.limit), inputPagination.page);
    }

    async getAllRestaurants(name: string, hasImage: boolean, inputPagination: InputPagination): Promise<PaginatedData> {
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
            .modify(function () {
                if (name) {
                    this.where("r.name", name);
                }
                if (hasImage !== undefined) {
                    if (hasImage) {
                        this.andWhere(function (queryBuilder) {
                            queryBuilder.whereNotNull("rhi.image_uuid");
                        })
                    } else {
                        this.andWhere(function (queryBuilder) {
                            queryBuilder.whereNull("rhi.image_uuid");
                        })
                    }
                }
            })

        const pageInfo = await this.getPageInfo(query, inputPagination);
        const rows = await this.addPagination(query, inputPagination)
        return new PaginatedData(rows, pageInfo);
    }
}