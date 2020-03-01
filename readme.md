# Refinebio GraphQL Project

This is a proof of concept for a GraphQL api on top of refinebio's restful api https://api.refine.bio/

A demo can be checked at https://refinebio-graphql.now.sh/

Some example queries:

1. Get the total number of experiments

```
{
  experiments {
    count
  }
}
```

2. Get top 10 experiments with their accession codes and number of samples

```
{
  experiments(limit: 2) {
    count
    results {
      accessionCode
      processSamples: samples(filter: { isProcessed: true }) {
        count
      }
    }
  }
}
```
