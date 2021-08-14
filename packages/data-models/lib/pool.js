import { ApiBase } from "./api-base.js";
import { Item } from "./item.js";

const searchPath = "/api/search";
const defaults = { devMode: false };
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

export class Pool extends ApiBase {
  #config
  #lastResults;
  #lastRawResults;
  attributes;
  description;
  id;
  mode;
  name;
  sortOptions;
  source;
  url;
  lastResultCount;
  verbose;
  debug;

  set lastResults(results) {
    if (results.group_list) {
      this.lastConfidence = results.confidence;
      this.lastResultCount = results.pagination.total;
      this.#lastRawResults = results.group_list;
      this.#lastResults = results.group_list.map(r=>new Item(r));
    } else {
      this.lastConfidence - (results.confidence)? results.confidence:'';
      this.lastResultCount = (results.pagination.total)? results.pagination.total: 0;
      this.#lastRawResults = [];
      this.#lastResults = [];
    }
  }
  get lastResults() {
    return this.#lastResults;
  }

  get hasMoreHits() {
    return (!this.lastResultCount || this.lastResultCount<=0)?
      false:
      (this.lastResultCount > this.lastResults.length)?
        true:
        false;
  }

  constructor(config) {
    super();
    this.#config = { ...poolDefaults, ...config };
    this.attributes = this.#config.attributes;
    this.description = this.#config.description;
    this.id = this.#config.id;
    this.mode = this.#config.mode;
    this.name = this.#config.name;
    this.sortOptions = this.#config["sort_options"];
    this.source = this.#config.source;
    this.url = this.#config.url;
    this.verbose = this.#config.verbose;
    this.debug = this.#config.debug;
    if (!this.url ) {
      throw "A Pool needs to be initilized with at least a url so we know where to look for stuff";
    }
  }

  get _queryparams() {
    return `${(this.verbose || this.debug)?'?':''}${this.verbose?'verbose=1&':''}${this.debug?'debug=1':''}`;
  }


  fetchResults(config) {
    let params = { ...this.searchDefaults, ...config };
    return this.authorize().then((token) => {
      // Lets get some results 
      return fetch(`${this.url}${searchPath}${this._queryparams}`, {
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
console.log(data);      
          this.lastKeyword = params.keyword;
          this.lastStart = params.start;
          this.lastRows = params.rows;
          this.lastResults = data;  
          return data;
        });
    });
  }
}