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

  async createToken() {
    const { id } = await this.post('token/', {});
    // activate the token
    await this.put(`token/${id}/`, { is_activated: true });
    return { id };
  }

  async getDataset(id) {
    let dataset = await this.get(`dataset/${id}`);
    return this.dataSetReducer(dataset);
  }

  async updateDataset(dataset) {
    let updatedDataset = await this.put(`dataset/${dataset.id}/`, {
      data: dataset.data,
      aggregate_by: dataset.aggregateBy,
      scale_by: dataset.scaleBy,
      quantile_normalize: dataset.quantileNormalize,
      quant_sf_only: dataset.quantSfOnly,
      svd_algorithm: dataset.svdAlgorithm
    });

    return this.dataSetReducer(updatedDataset);
  }

  async createDataset(dataset = null) {
    let createdDataset = await this.post('dataset/', { data: {} });

    if (dataset) {
      createdDataset = await this.updateDataset({
        id: createdDataset.id,
        data: createdDataset.data,
        ...dataset
      });
    }

    return this.dataSetReducer(createdDataset);
  }

  dataSetReducer(raw) {
    return {
      ...raw,
      aggregateBy: raw.aggregate_by,
      scaleBy: raw.scale_by,
      isProcessing: raw.is_processing,
      isProcessed: raw.is_processed,
      isAvailable: raw.is_available,
      hasEmail: raw.has_email,
      expiresOn: raw.expires_on,
      s3Bucket: raw.s3_bucket,
      s3Key: raw.s3_key,
      success: raw.success,
      failureReason: raw.failure_reason,
      createdAt: raw.created_at,
      lastModified: raw.last_modified,
      start: raw.start,
      sizeInBytes: raw.size_in_bytes,
      sha1: raw.sha1,
      quantileNormalize: raw.quantile_normalize,
      quantSfOnly: raw.quant_sf_only,
      svdAlgorithm: raw.svd_algorithm
    };
  }
}

module.exports = RefinebioAPI;
