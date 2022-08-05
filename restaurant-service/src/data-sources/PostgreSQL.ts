import { SQLDataSource } from 'datasource-sql';
import CountryModel from '../models/countryModel';
import RestaurantModel from '../models/restaurantModel';

export default class PostgreSQL extends SQLDataSource {
    private buildModel(row: any): RestaurantModel {
        return new RestaurantModel({
            restaurantUuid: row.restaurant_uuid,
            name: row.name,
            country: new CountryModel({
                code: row.country_code,
                locales: row.locales,
            }),
            images: [row.image_uuid],
        });
    }
    
    getAllRestaurants(name: string, hasImage: boolean) {
        const query =  this.knex
            .select("r.restaurant_uuid", "r.name", "c.country_code", "c.locales", "rhi.image_uuid")
            .from("restaurant AS r")
            .leftJoin("restaurant_has_image AS rhi", "r.restaurant_uuid", "rhi.restaurant_uuid")
            .leftJoin("country AS c", "r.country_code", "c.country_code")
            .modify(function () {
                if (name) {
                    this.where("r.name", name);
                }
                if (hasImage !== undefined) {
                    if (hasImage) {
                        this.andWhere(function(queryBuilder) {
                            queryBuilder.whereNotNull( "rhi.image_uuid");
                        })
                    } else {
                        this.andWhere(function(queryBuilder) {
                            queryBuilder.whereNull( "rhi.image_uuid");
                        })
                    }
                }
            })

            return query.then(rows => {
                // Grouping images by restaurant_uuid
                const result = rows.reduce((acc: any, row: any) => {
                    if (acc[row.restaurant_uuid]) {
                        acc[row.restaurant_uuid].images.push(row.image_uuid);
                    } else {
                        acc[row.restaurant_uuid] = this.buildModel(row);
                    }

                    return acc
                }, {});
                return Object.values(result);
            });
    }
}