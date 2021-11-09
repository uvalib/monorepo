const defaults$1 = {
  devMode: false,
  dummyMode: false,
};

class Sirsi {
  #authtoken;
  #user;
  #config;
  #host;
  #fillholdpath;
  #lastfillhold;

  constructor(config) {
    this.#config = { ...defaults$1, ...config };
    this.devMode = this.#config.devMode;
    this.dummyMode = this.#config.dummyMode;
  }

  // Getters/Setters
  set devMode(val) {
    if (!!val) {
      console.error(
        "dev mode is true but there is no dev mode for this currently!!!"
      );
    } else {
      console.info("dev mode is false");
      this.#host = "https://qmo3jwybkg.execute-api.us-east-1.amazonaws.com";
      this.#fillholdpath = "/production/library/fillholdreader/";
    }
  }

  get authenticated() {
    return !!this.#authtoken;
  }

  authorize(userid, password) {
    return this.authenticated
      ? // If we have a token we are authorized already, just return the token in an empty promise
        Promise.resolve(this.#authtoken)
      : this.dummyMode
      ? // Just make up something and return it in a promise
        Promise.resolve({ sessionToken: "55555555559" }).then((data) => {
          this.#user - data;
          this.#authtoken = data.sessionToken;
          return this.#authtoken;
        })
      : // Get an auth token if we don't already have one
        fetch(
          "https://qmo3jwybkg.execute-api.us-east-1.amazonaws.com/production/library/fillholdreader/555",
          {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
              userid: userid,
              password: password,
              action: "auth",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            this.#user = data;
            this.#authtoken = data.sessionToken;
            console.info(`auth token: ${this.#authtoken}`);
            console.info(this.#user);
            return this.#authtoken;
          });
  }

  fillhold(barcode, override = false) {
    let url = `https://qmo3jwybkg.execute-api.us-east-1.amazonaws.com/production/library/fillholdreader/${barcode}`;
    let now = new Date();
    let headers = { sessiontoken: this.#authtoken };
    if (override) headers.override = "OK";
    return !this.authenticated
      ? Promise.resolve({
          timestamp: now,
          hold: { error_messages: ["not authenticated"] },
        })
      : !this.dummyMode
      ? fetch(url, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          headers: headers,
        })
          .then((res) => res.json())
          .then((data) => {
            data.timestamp = now;
            this.#lastfillhold = data;
            return data;
          })
      : barcode === "error"
      ? Promise.resolve({
          timestamp: now,
          hold: {
            error_messages: ["No hold for this item."],
            title:
              "Interview with Walter N. Ridley [videorecording] / April 10, 1989",
            author: "Ridley, Walter Nathaniel, 1910-1996.",
            item_id: "X032396510",
          },
        })
      : barcode === "override" && !override
      ? Promise.resolve({
          hold: {
            error_messages: [
              {
                code: "itemHasMultiplePieces",
                message: "This item has multiple pieces.",
              },
            ],
            title: "The Oxford handbook of philosophy and literature",
            author: "Eldridge, Richard Thomas, 1953-",
            item_id: "X030566353",
            user_full_name: "LEO COPY",
            user_id: "999999462",
            pickup_library: "LEO",
          },
          user: {
            Message: "User with external user id 999999462 was not found.",
          },
        })
      : Promise.resolve({
          timestamp: now,
          hold: {
            error_messages: [],
            title: "Developmental cascades : building the infant mind",
            author: "Oakes, Lisa M., 1963- author.",
            item_id: "X032591695",
            user_full_name: "Reighart, Renee Allison",
            user_id: "rar6u",
            pickup_location: "CLEMONS",
          },
          user: {
            UserName: "rar6u",
            ExternalUserId: "rar6u",
            LastName: "Reighart",
            FirstName: "Renee",
            SSN: "",
            Status: "Faculty",
            EMailAddress: "rar6u@virginia.edu",
            Phone: "434-555-5555",
            Department: "Library",
            NVTGC: "ILL",
            NotificationMethod: "Electronic",
            DeliveryMethod: "Hold for Pickup",
            LoanDeliveryMethod: "Hold for Pickup",
            LastChangedDate: "2018-11-06T10:20:39",
            AuthorizedUsers: "",
            Cleared: "Yes",
            Web: true,
            Address: "",
            Address2: "",
            City: "",
            State: "",
            Zip: "",
            Site: null,
            ExpirationDate: "2019-11-06T10:20:39",
            Number: "",
            UserRequestLimit: 0,
            Organization: "",
            Fax: "Dept",
            ShippingAcctNo: null,
            ArticleBillingCategory: "",
            LoanBillingCategory: "",
            Country: "Ivy Cottage",
            SAddress: null,
            SAddress2: null,
            SCity: null,
            SState: null,
            SZip: null,
            SCountry: null,
            RSSID: "1149",
            AuthType: "Default",
            UserInfo1: "Library",
            UserInfo2: null,
            UserInfo3: null,
            UserInfo4: null,
            UserInfo5: null,
            MobilePhone: null,
          },
        });
  }
}

class ApiBaseVirgo {
  authtoken;
  searchDefaults;
  searchPath;
  itemPath;
  availabilityPath;

  constructor() {
    this.authtoken = (window.UVALibVirgo && window.UVALibVirgo.authtoken)? window.UVALibVirgo.authtoken:null;
    this.searchPath = "/api/search";
    this.itemPath = "/api/resource";
    this.availabilityPath = "/api/availability";
    this.searchDefaults = { start: 0, rows: 5, keyword: "", debug: false, verbose: false };
  }

  get defaultFetchOptions() {
    return {method: "GET",headers: {"Content-Type": "application/json", Authorization: `Bearer ${this.authtoken}`}};
  }

  get authenticated() {
    return !!this.authtoken;
  }

  authorize() {
    return this.authenticated
      ? // If we have a token we are authorized already, just return the token in an empty promise
        Promise.resolve(this.authtoken)
      : // Get an auth token if we don't already have one
        fetch("https://search.lib.virginia.edu/authorize", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
        })
          .then((res) => res.text())
          .then((data) => {
            this.authtoken = data;
            if(!window.UVALibVirgo) window.UVALibVirgo = {};
            window.UVALibVirgo.authtoken = this.authtoken;
            return this.authtoken;
          });
  }

  fetch(url, options={}) {
    return this.authorize().then( ()=>{
      options = {...this.defaultFetchOptions,...options};
      return fetch(url, options).then((res) => res.json())
    });
  }


}

class Item extends ApiBaseVirgo {

  poolId;
  poolURL;
  raw_item;
  fields;
  id;
  title;
  author;

  constructor(raw) {
    super();
    this.raw_item = raw;
    this.fields = {};
    this.id = [];
    this.title = [];
    this.author = [];
    // parse things out a bit
    this.records = raw.record_list;
    if (this.records) {
      this.records.forEach(rec => {
        this._upgradeFields(rec.fields);
        rec.fields.forEach(field=>{
          if (field.name === 'id') this.id.push(field.value);
          if (field.type === 'title') this.title.push(field.value);
          if (field.type === 'author') this.author.push(field.value);
        });
  
      });
    } else {
      this.raw_item = raw.raw_item;
      this.fields = raw.fields;
      this.id = raw.id;
      this.title = raw.title;
      this.author = raw.author;
      this.resultIndex = raw.resultIndex;
    }
  }

  _upgradeFields(rawFields){
    rawFields.forEach(field => {
      if (!this.fields[field.name]) this.fields[field.name] = [];
      this.fields[field.name].push(field);
    });
  }

  fetchItem() {
    return this.fetch(`https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/resource/${this.id[0]}`)
      .then(function(data){ 
        this.fields = {};
        this._upgradeFields(data.fields);           
        return data;
      }.bind(this));   
  }
}

const searchPath$1 = "/api/search";
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

class Pool extends ApiBaseVirgo {
  #config
  #lastResults;
  #lastRawResults;
  #queryString;
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

  set queryString(qs) {
    if (qs != this.#queryString) {
      this.#lastRawResults = [];
      this.#lastResults = [];
      this.#queryString = qs;
    }
  }

  get queryString() {
    return this.#queryString;
  }

  set lastResults(results) {
    if (results.group_list) {
      this.lastConfidence = results.confidence;
      this.lastResultCount = results.pagination.total;
      this.#lastRawResults = this.#lastRawResults.concat( results.group_list );
      this.#lastResults = this.#lastResults.concat( results.group_list.map(r=>new Item(r)) );
      this.#lastResults.forEach((r,idx)=>{r.resultIndex=idx;});
    } else {
      this.lastConfidence - (results.confidence)? results.confidence:'';
      this.lastResultCount = (results.pagination.total)? results.pagination.total: 0;
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
    this.#lastRawResults = [];
    this.#lastResults = [];
    this.#queryString = "";
    if (!this.url ) {
      throw "A Pool needs to be initilized with at least a url so we know where to look for stuff";
    }
  }

  get _queryparams() {
    return `${(this.verbose || this.debug)?'?':''}${this.verbose?'verbose=1&':''}${this.debug?'debug=1':''}`;
  }

  getMore(){
    return this.fetchResults({ ...this.lastParams, ...{rows: this.lastRows, start: this.lastStart+this.lastRows} })
  }

  fetchResults(config) {
    let params = { ...this.searchDefaults, ...config };
    if (params.keyword) this.queryString = params.keyword;
    return this.fetch(`${this.url}${searchPath$1}${this._queryparams}`, {
      method: "POST",
      body: JSON.stringify({
        query: `keyword: {${this.queryString}}`,
        pagination: { start: params.start, rows: params.rows },
      })
    }).then((data) => {
      this.lastParams = params;
      this.lastKeyword = params.keyword;
      this.lastStart = params.start;
      this.lastRows = params.rows;
      this.lastResults = data;  
      return data;
    });
  }

}

const searchPath = "/api/search";
const defaults = { devMode: false };

// just a little helper method
function mappedToID(list) {
  return Object.assign({}, ...list.map((i) => ({ [i.id]: i })));
}

class Catalog extends ApiBaseVirgo {
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

export { Catalog, Sirsi };
