const GraphQLJSON = require('graphql-type-json');

module.exports = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSON.GraphQLJSONObject,
  Mutation: {
    createToken(_, args, { dataSources }) {
      return dataSources.refinebioAPI.createToken();
    },
    createDataset(_, { dataset }, { dataSources }) {
      return dataSources.refinebioAPI.createDataset(dataset);
    },
    updateDataset(_, { dataset }, { dataSources }) {
      return dataSources.refinebioAPI.updateDataset(dataset);
    }
  },
  Query: {
    experiments: async (_, { limit = 25, offset = 0 }, { dataSources }) => {
      const allExperiments = await dataSources.refinebioAPI.getAllExperiments({
        limit,
        offset
      });
      return allExperiments;
    },
    search: async (_, { q, limit = 25, offset = 0 }, { dataSources }) => {
      const allExperiments = await dataSources.refinebioAPI.searchExperiments({
        q,
        limit,
        offset
      });
      return allExperiments;
    },
    dataset: async (_, { id }, { dataSources }) => {
      return dataSources.refinebioAPI.getDataset(id);
    }
  },
  Experiment: {
    samples: async (
      experiment,
      { limit = 25, offset = 0, filter },
      { dataSources }
    ) =>
      dataSources.refinebioAPI.getExperimentSamples({
        accessionCode: experiment.accessionCode,
        limit,
        offset,
        filter
      })
  },
  ExperimentSearchResult: {
    samples: async (experiment, { limit = 25, offset = 0 }, { dataSources }) =>
      dataSources.refinebioAPI.getExperimentSamples({
        accessionCode: experiment.accessionCode,
        limit,
        offset
      })
  }
};
