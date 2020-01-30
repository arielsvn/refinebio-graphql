const { RESTDataSource } = require('apollo-datasource-rest');

class RefinebioAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.refine.bio/v1';
  }

  experimentReducer(rawExperiment) {
    return {
      id: rawExperiment.id,
      accessionCode: rawExperiment.accession_code
    };
  }

  async getAllExperiments({ limit, offset }) {
    const { results } = await this.get('experiments', { limit, offset });

    // transform the raw experiments to a more friendly
    return results.map(experiment => this.experimentReducer(experiment));
  }

  sampleReducer(rawSample) {
    return {
      id: rawSample.id,
      accessionCode: rawSample.accession_code,
      isProcessed: rawSample.is_processed
    };
  }

  async getExperimentSamples({ accessionCode, limit = 25, offset = 0 }) {
    const { results } = await this.get('samples', {
      experiment_accession_code: accessionCode,
      limit,
      offset
    });

    // transform the raw experiments to a more friendly
    return results.map(sample => this.sampleReducer(sample));
  }

  async searchExperiments({ q, limit, offset }) {
    const { results } = await this.get('search', {
      search: q,
      limit,
      offset
    });

    // transform the raw experiments to a more friendly
    return results.map(experiment => this.sampleReducer(experiment));
  }

  searchResultReducer(raw) {
    return {
      ...raw,
      accessionCode: raw.accession_code,
      hasPublication: raw.has_publication
    };
  }
}

module.exports = RefinebioAPI;
