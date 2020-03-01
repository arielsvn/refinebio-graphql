const { paginateResults } = require('./utils');

module.exports = {
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
