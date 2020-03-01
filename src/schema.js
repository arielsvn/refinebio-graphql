const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar JSON

  type Query {
    experiments(limit: Int, offset: Int): ExperimentPaginated!
    search(q: String, limit: Int, offset: Int): [ExperimentSearchResult]!
  }

  type Mutation {
    createToken: Token!
    createDataset: Dataset!
  }

  type Token {
    id: String!
  }

  type Dataset {
    id: String!
    aggregateBy: String
    scaleBy: String
    data: JSON
    isProcessed: Boolean
    isProcessing: Boolean
    isAvailable: Boolean
    expiresOn: String
    s3Bucket: String
    s3Key: String
    success: Boolean
    failureReason: String
    createdAt: String
    lastModified: String
    sizeInBytes: Float
    sha1: String
    quantileNormalize: Boolean
    quantSfOnly: Boolean
    svdAlgorithm: String
  }

  type PageInfo {
    hasNextPage: Boolean
    hasPrevPage: Boolean
  }

  interface IPaginated {
    count: Int
    pageInfo: PageInfo
  }

  type ExperimentPaginated implements IPaginated {
    count: Int
    pageInfo: PageInfo
    results: [Experiment]
  }

  type Experiment {
    id: Int
    accessionCode: String
    samples(limit: Int, offset: Int, filter: SampleFilterInput): SamplePaginated
  }

  input SampleFilterInput {
    isProcessed: Boolean
  }

  type SamplePaginated implements IPaginated {
    count: Int
    pageInfo: PageInfo
    results: [Sample]
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
