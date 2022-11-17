var _LibGuidesData_instances, _LibGuidesData_parseResults;
import { __classPrivateFieldGet } from "tslib";
// needs a q (query) parameter appended onto the end!
const libGuidesAPIURL = "https://api.library.virginia.edu/libguides/srch_process_cs.php?action=580&search_source_id=0&layout=tab&start=0&group_id=0&guide_id=0&f_group_id=&f_guide_type_id=&f_guide_owner_id=&f_guide_tag_ids=&f_guide_subject_ids=&sort=_score";
export class LibGuidesData {
    constructor(init) {
        _LibGuidesData_instances.add(this);
        this.query = "";
        this.items = [];
        // setup initial parameters
        if (init.query)
            this.query = init.query;
    }
    // eslint-disable-next-line class-methods-use-this
    async fetchData() {
        return fetch(`${libGuidesAPIURL}q=${this.query}`)
            .then(r => r.json())
            .then(d => {
            __classPrivateFieldGet(this, _LibGuidesData_instances, "m", _LibGuidesData_parseResults).call(this, d.data.results);
            return this.items;
        });
    }
}
_LibGuidesData_instances = new WeakSet(), _LibGuidesData_parseResults = function _LibGuidesData_parseResults(data) {
    const detachedDiv = document.createElement('div');
    detachedDiv.innerHTML = data;
    const resultNodes = detachedDiv.querySelectorAll('.s-srch-result');
    this.items = Array.from(resultNodes).map((node) => {
        var _a, _b;
        return ({
            title: (_a = node.querySelector('.s-srch-result-title')) === null || _a === void 0 ? void 0 : _a.innerHTML.replace(/\s\s/g, ' '),
            description: (_b = node.querySelectorAll('.s-srch-result-meta')[1]) === null || _b === void 0 ? void 0 : _b.innerHTML.replace(/\s\s/g, ' '),
            link: ""
        });
    });
    detachedDiv.remove();
};
//# sourceMappingURL=LibGuidesData.js.map