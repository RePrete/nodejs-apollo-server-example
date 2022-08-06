import { gql } from 'apollo-server-express';
import RestaurantRowToModelFactory from '../models/factories/restaurant/restaurantModelFactory';
import { PaginatedRestaurants } from '../models/restaurantModel';
import { InputPagination, PaginatedData } from '../utils/pagination';
import { MapProvider } from '../utils/providers';

export const typeDefs = gql`
  type PaginatedRestaurants implements PaginatedResult {
    restaurants: [Restaurant]
    pagination: Pagination
  }

  type Restaurant {
    restaurantUuid: ID
    name: String
    country: Country
    images: [String]
    allowReviews: Boolean!
  }

  type Country {
    code: String!
    locales: [String!]!
  }

  type Query {
    restaurants(name: String, hasImage: Boolean, pagination: PaginationInput): PaginatedRestaurants
  }
`;

export const resolvers = {
  Query: {
    restaurants: async (_parent: any, args: any, { dataSources }: any, _info: any) => {
      const pagination = new InputPagination(args.pagination);

      const response = await dataSources.imageAPI.getImages()
      const images = response.reduce((map: Map<string, string>, image: { imageUuid: string; url: string; }) => {
        map.set(image.imageUuid, image.url)
        return map
      }, new Map<string, string>())
      const provider = new MapProvider(images)

      const paginatedData: PaginatedData = await dataSources.pg.getAllRestaurants(args.name, args.hasImage, pagination)
      return new PaginatedRestaurants({
        restaurants: paginatedData.data.map((restaurantRow: any) => {
          return RestaurantRowToModelFactory.create(restaurantRow, provider)
        }),
        pagination: paginatedData.pageInfo
      });
    },
  }
};