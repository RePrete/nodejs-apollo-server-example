import { PageInfo } from "../utils/pagination";
import CountryModel from "./countryModel";
export class RestaurantModel {
    public restaurantUuid: string
    public name: string
    public country: CountryModel
    public images: string[]
    public allowReviews: boolean
    
    constructor({
        restaurantUuid,
        name,
        country,
        images,
        allowReviews
    }: {
        restaurantUuid: string,
        name: string,
        country: CountryModel,
        images: string[],
        allowReviews: boolean
    }) {
        this.restaurantUuid = restaurantUuid;
        this.name = name;
        this.country = country;
        this.images = images;
        this.allowReviews = allowReviews;
    }
}

export class PaginatedRestaurants {
    public restaurants: RestaurantModel[]
    public pagination: PageInfo

    constructor({
        restaurants,
        pagination
    }: {
        restaurants: RestaurantModel[],
        pagination: PageInfo
    }) {
        this.restaurants = restaurants;
        this.pagination = pagination;
    }
}