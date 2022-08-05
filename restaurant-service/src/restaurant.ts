import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Restaurant {
    restaurantUuid: String
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
    restaurants(name: String, hasImage: Boolean): [Restaurant]
  }
`;

export const resolvers = {
  Query: {
    restaurants: async (_parent: any, args: any, { dataSources }: any, _info: any) => {
      const { body } = await dataSources.imageAPI.getImages()
      const provider = body.images.reduce((map: { [x: string]: string; }, image: { imageUuid: string; url: string; }) => {
        map[image.imageUuid] = image.url
        return map
      } , {})

      const restaurants = await dataSources.pg.getAllRestaurants(args.name, args.hasImage);
      for (const restaurant of restaurants) {
        restaurant.resolveImages(provider);
      }
      return restaurants;
    },
  }
};