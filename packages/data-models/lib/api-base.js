export class ApiBase {
  authtoken;
  searchDefaults;
  searchPath;
  itemPath
  availabilityPath

  constructor() {
    this.authtoken = (window.UVALibVirgo && window.UVALibVirgo.authtoken)? window.UVALibVirgo.authtoken:null;
    this.searchPath = "/api/search";
    this.itemPath = "/api/resource";
    this.availabilityPath = "/api/availability";
    this.searchDefaults = { start: 0, rows: 5, keyword: "", debug: false, verbose: false };
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


}