import { DataProviderInterface } from "../../../utils/providers";
import CountryModel from "../../countryModel";
import { RestaurantModel } from "../../restaurantModel";

const countryCodesWithAllowedReview = ["FR"];

export default class RestaurantRowToModelFactory {
     static create(row: any, imagesProvider: DataProviderInterface): RestaurantModel {
        return new RestaurantModel({
            restaurantUuid: row.restaurant_uuid,
            name: row.name,
            country: new CountryModel({
                code: row.country_code,
                locales: row.locales,
            }),
            images: row.images.reduce(function(result: any[], image: string) {
                if (imagesProvider.has(image)) {
                    result.push(imagesProvider.get(image));
                }
                return result;
            }, []),
            allowReviews: countryCodesWithAllowedReview.includes(row.country_code)
        });
    }
}