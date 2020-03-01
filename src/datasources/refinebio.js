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
    const page = await this.get('experiments', { limit, offset });

    // transform the raw experiments to a more friendly
    return this.pageReducer(page, experiment =>
      this.experimentReducer(experiment)
    );
  }

  pageReducer(page, itemsReducer) {
    return {
      count: page.count,
      pageInfo: {
        hasNextPage: !!page.next,
        hasPreviousPage: !!page.previous
      },
      results: page.results.map(itemsReducer)
    };
  }

  sampleReducer(rawSample) {
    return {
      id: rawSample.id,
      accessionCode: rawSample.accession_code,
      isProcessed: rawSample.is_processed
    };
  }

  async getExperimentSamples({
    accessionCode,
    limit = 25,
    offset = 0,
    filter
  }) {
    const params = { experiment_accession_code: accessionCode, limit, offset };
    if (filter) {
      const { isProcessed } = filter;
      if (isProcessed !== undefined) {
        params['is_processed'] = isProcessed;
      }
    }
    const page = await this.get('samples', params);

    // transform the raw experiments to a more friendly
    return this.pageReducer(page, sample => this.sampleReducer(sample));
  }

  async searchExperiments({ q, limit, offset }) {
    const page = await this.get('search', {
      search: q,
      limit,
      offset
    });

    // transform the raw experiments to a more friendly
    return this.pageReducer(page, experiment => this.sampleReducer(experiment));
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
