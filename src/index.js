require('dotenv').config();

const { ApolloServer } = require('apollo-server');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const RefinebioAPI = require('./datasources/refinebio');

// set up any dataSources our resolvers need
const dataSources = () => ({
  refinebioAPI: new RefinebioAPI()
});

// the function that sets up the global context for each resolver, using the req
const context = async ({ req }) => {
  return {};
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  introspection: true,
  playground: true,
  tracing: true,
  engine: {
    apiKey: process.env.ENGINE_API_KEY
  }
});

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== 'test') {
  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 app running at ${url}`);
  });
}

// export all the important pieces for integration/e2e tests to use
module.exports = {
  dataSources,
  context,
  typeDefs,
  resolvers,
  ApolloServer,
  RefinebioAPI,
  server
};
