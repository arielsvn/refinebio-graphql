const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    experiments(limit: Int, offset: Int): [Experiment]!
    search(q: String, limit: Int, offset: Int): [ExperimentSearchResult]!
  }

  type Experiment {
    id: Int
    accessionCode: String
    samples(limit: Int, offset: Int): [Sample]
  }

  type Sample {
    id: Int
    accessionCode: String
    isProcessed: Boolean
  }

  type ExperimentSearchResult {
    id: Int
    accessionCode: String!
    title: String
    hasPublication: Boolean
    publicationTitle: String
    samples(limit: Int, offset: Int): [Sample]
  }
`;

module.exports = typeDefs;
