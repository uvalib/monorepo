var _LibrariesData_instances, _LibrariesData_parseResults;
import { __classPrivateFieldGet } from "tslib";
const librariesEndpointURL = "http://library-drupal-dev-0.internal.lib.virginia.edu:8080/libs?_format=json";
export class LibrariesData {
    constructor() {
        _LibrariesData_instances.add(this);
        this.query = "";
        this.items = [];
        this.libraries = [];
    }
    async fetchData() {
        return fetch(librariesEndpointURL)
            .then(r => r.json())
            .then(data => {
            __classPrivateFieldGet(this, _LibrariesData_instances, "m", _LibrariesData_parseResults).call(this, data);
            return this.libraries;
        });
    }
}
_LibrariesData_instances = new WeakSet(), _LibrariesData_parseResults = function _LibrariesData_parseResults(d) {
    // eslint-disable-next-line no-console
    console.log(d);
};
//# sourceMappingURL=LibrariesData.js.map