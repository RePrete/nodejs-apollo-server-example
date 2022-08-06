import {HTTPDataSource} from 'apollo-datasource-http'

export default class ImageAPI extends HTTPDataSource {
    async getImages() {
        const response = await this.get("/images")
        const body = await response.body;
        // @ts-ignore
        return body.images;
    }
}