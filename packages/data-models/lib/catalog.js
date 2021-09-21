import { ApiBase } from "./api-base.js";
import { Pool } from "./pool.js";

const searchPath = "/api/search";
const defaults = { devMode: false };

// just a little helper method
function mappedToID(list) {
  return Object.assign({}, ...list.map((i) => ({ [i.id]: i })));
}

export class Catalog extends ApiBase {
  #config;
  #host;
  #lastPools;
  lastKeyword;
  lastStart;
  lastRows;
  lastRequest;
  lastSuggestions;

  constructor(config) {
    super();
    this.#config = { ...defaults, ...config };
    this.devMode = this.#config.devMode;
  }

  // Getters/Setters
  set devMode(val) {
    if (!!val) {
      // ToDo:  I don't think that this is the dev url (don't think it matters as this is read only currently)
      this.#host = "https://search-ws.internal.lib.virginia.edu";
    } else {
      this.#host = "https://search-ws.internal.lib.virginia.edu";
    }
  }

  set lastPools(rawPools) {
    if (Array.isArray(rawPools)) {
      this.#lastPools = rawPools.map((p) => new Pool(p));
    }
  }

  get lastPools() {
    return this.#lastPools;
  }

  set lastPoolResults(rawPoolResults) {
    if (Array.isArray(rawPoolResults)) {
      this.poolsPromise.then((pools) => {
        rawPoolResults.forEach((rawPoolResult) => {
          pools[rawPoolResult["pool_id"]].lastResults = rawPoolResult;
        });
      });
    }
  }

  get lastPoolResluts() {
  }

  get poolsPromise() {
    return this.lastPools
      ? Promise.resolve(mappedToID(this.lastPools))
      : this.fetchResults({ rows: 0 }).then(() => {
          return mappedToID(this.lastPools);
        });
  }

  fetchResults(config) {
    let params = { ...this.searchDefaults, ...config };
    return this.fetch(`${this.#host}${searchPath}`,{
      method: "POST",
      body: JSON.stringify({
        query: `keyword: {${params.keyword}}`,
        pagination: { start: params.start, rows: params.rows },
      })
    })
      .then((data) => {
        this.lastKeyword = params.keyword;
        this.lastStart = params.start;
        this.lastRows = params.rows;
        this.lastPools = data.pools;
        this.lastResultCount = data.total_hits;
        this.lastPoolResults = data.pool_results;
        this.lastRequest = data.request;
        this.lastSuggestions = data.suggestions;
        return data;
      });
  }

}