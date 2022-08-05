import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import config from 'config';
import { PostgreSQL, ImageAPI } from './data-sources/index';
import { typeDefs as Restaurant, resolvers as restaurantResolvers } from './restaurant';

// These types definitions and resolvers are just an example, you can remove them and move the new types and resolvers elsewhere if you want.

const main = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs: [Restaurant],
    resolvers: restaurantResolvers,
    dataSources: () => ({
      pg: new PostgreSQL({
        client: 'pg',
        connection: config.get('database')
      }),
      imageAPI: new ImageAPI(
        `${config.get('services.image.protocol')}://${config.get('services.image.host')}:${config.get('services.image.port')}`
      ),
    })
  });

  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: config.get('server.port') }, () => console.info(
    `🚀 Server ready and listening at ==> http://localhost:${config.get('server.port')}${
      server.graphqlPath
    }`,
  ));
};

main().catch((error) => {
  console.error('Server failed to start', error);
});
