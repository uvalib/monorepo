import { ApiBase } from "./api-base.js";

const searchPath = "/api/search";

export class Item extends ApiBase {

  poolId;
  poolURL;

  constructor(raw) {
    super();
    this.raw_item = raw;
    this.fields = {};
    this.id = [];
    this.title = [];
    // parse things out a bit
    if ( raw.record_list && Array.isArray(raw.record_list) ) {
      this.records = raw.record_list;
      raw.record_list.forEach(rec => {
        if ( rec.fields && Array.isArray(rec.fields) ) {
          rec.fields.forEach(field => {
            this.fields[field.name] = field;
            if (field.name === 'id') this.id.push(field.value);
            if (field.type === 'title') this.title.push(field.value);
          });
        }        
      });
    }
  }

  fetchItem() {
    return this.authorize().then((token) => {
      // Lets get the full record for the item 
      return fetch(`https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/resource/${this.id[0]}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      })
      .then((res) => res.json())
      .then((data) => {
console.log(data)        
          return data;
      });
    });
  }
}