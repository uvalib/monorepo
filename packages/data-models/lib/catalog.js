const searchPath = "/api/search";
const defaults = { devMode: false };
const searchDefaults = { start: 0, rows: 5, keyword: "", debug: false, verbose: false };
const poolDefaults = {
  attributes: [],
  description: "",
  id: "",
  mode: "",
  name: "",
  sort_options: [],
  source: "",
  url: "",
};

function mappedToID(list) {
  return Object.assign({}, ...list.map((i) => ({ [i.id]: i })));
}

export class Pool {
  #config;
  #lastResults;
  attributes;
  description;
  id;
  mode;
  name;
  sortOptions;
  source;
  url;
  lastResultCount;

  set lastResults(results) {
    this.#lastResults = results;
    this.lastResultCount =
      results && results.pagination && results.pagination.total
        ? results.pagination.total
        : 0;
  }
  get lastResults() {
    return this.#lastResults;
  }

  constructor(config) {
    this.#config = { ...poolDefaults, ...config };
    this.attributes = this.#config.attributes;
    this.description = this.#config.description;
    this.id = this.#config.id;
    this.mode = this.#config.mode;
    this.name = this.#config.name;
    this.sortOptions = this.#config["sort_options"];
    this.source = this.#config.source;
    this.url = this.#config.url;
  }

  fetchResults(config) {
    let params = { ...searchDefaults, ...config };
    return this.authorize().then((token) => {
      // Lets get some results
//      return fetch(`${this.#host}${searchPath}`, {
//        method: "POST",
//        headers: {
//          "Content-Type": "application/json",
//          Authorization: `Bearer ${token}`,
//        },
//        body: JSON.stringify({
//          query: `keyword: {${params.keyword}}`,
//          pagination: { start: params.start, rows: params.rows },
//        }),
//      })
//        .then((res) => res.json())
//        .then((data) => {
//          this.lastKeyword = params.keyword;
//          this.lastStart = params.start;
//          this.lastRows = params.rows;
//          this.lastPools = data.pools;
//          this.lastResultCount = data.total_hits;
//          this.lastPoolResults = data.pool_results;
//          this.lastRequest = data.request;
//          this.lastSuggestions = data.suggestions;
//          return data;
//        });
    });
  }
}

export class Catalog {
  #authtoken;
  #config;
  #host;
  #lastPools;
  lastKeyword;
  lastStart;
  lastRows;
  lastRequest;
  lastSuggestions;

  constructor(config) {
    this.#config = { ...defaults, ...config };
    this.devMode = this.#config.devMode;
  }

  // Getters/Setters
  set devMode(val) {
    if (!!val) {
      // ToDo:  I don't think that this is the dev url (don't think it matters as this is read only currently)
      console.info("dev mode is true");
      this.#host = "https://search-ws.internal.lib.virginia.edu";
    } else {
      console.info("dev mode is false");
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

  get lastPoolResluts() {}

  get poolsPromise() {
    return this.lastPools
      ? Promise.resolve(mappedToID(this.lastPools))
      : this.fetchResults({ rows: 0 }).then(() => {
          return mappedToID(this.lastPools);
        });
  }

  get authenticated() {
    return !!this.#authtoken;
  }

  authorize() {
    return this.authenticated
      ? // If we have a token we are authorized already, just return the token in an empty promise
        Promise.resolve(this.#authtoken)
      : // Get an auth token if we don't already have one
        fetch("https://search.lib.virginia.edu/authorize", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
        })
          .then((res) => res.text())
          .then((data) => {
            this.#authtoken = data;
            console.info(`auth token: ${this.#authtoken}`);
            return this.#authtoken;
          });
  }

  fetchResults(config) {
    let params = { ...searchDefaults, ...config };
    return this.authorize().then((token) => {
      return fetch(`${this.#host}${searchPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `keyword: {${params.keyword}}`,
          pagination: { start: params.start, rows: params.rows },
        }),
      })
        .then((res) => res.json())
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
    });
  }
}
