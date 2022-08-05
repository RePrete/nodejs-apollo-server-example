import { HTTPDataSource } from 'apollo-datasource-http'

export default class ImageAPI extends HTTPDataSource {
    async getImages() {
        return this.get("/images");
    }
}