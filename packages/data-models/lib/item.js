import { ApiBase } from "./api-base.js";

const searchPath = "/api/search";

export class Item extends ApiBase {

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
        })
  
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
