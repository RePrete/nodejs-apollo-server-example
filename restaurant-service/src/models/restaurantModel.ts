import CountryModel from "./countryModel";

const countryCodesWithAllowedReview = ["FR"];

export default class RestaurantModel {
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
    }: {
        restaurantUuid: string,
        name: string,
        country: CountryModel,
        images: string[],
    }) {
        this.restaurantUuid = restaurantUuid;
        this.name = name;
        this.country = country;
        this.images = images;
        this.allowReviews = countryCodesWithAllowedReview.includes(country.code);
    }
    public resolveImages(provider: { [x: string]: string; }): void {
        this.images = this.images.reduce(function(result: string[], image) {
            if (provider[image]) {
                result.push(provider[image]);
            }
            return result;
        }, [])
    }
}