import { G as GeneralData } from './ArticlesData-9f3aa85f.js';

class LibGuidesData extends GeneralData {
    constructor() {
        super(...arguments);
        this.libGuidesAPIURL = 'https://api.library.virginia.edu/libguides/srch_process_cs.php?action=580&search_source_id=0&layout=tab&start=0&group_id=0&guide_id=0&f_group_id=&f_guide_type_id=&f_guide_owner_id=&f_guide_tag_ids=&f_guide_subject_ids=&sort=_score';
    }
    async fetchData(params) {
        return fetch(`${this.libGuidesAPIURL}&q=${this.query}`)
            .then((r) => r.json())
            .then((d) => {
            this.meta.url = d.data.fulllink;
            this.parseResults(d.data.results);
            return {
                items: this.items.slice(0, params && params.limit ? params.limit : this.limit),
                meta: this.meta,
            };
        });
    }
    // Just putting this here in case we need to adjust the markup returned here
    descriptionMarkupFix(data) {
        return data;
    }
    parseResults(data) {
        const detachedDiv = document.createElement('div');
        detachedDiv.innerHTML = data;
        const resultNodes = detachedDiv.querySelectorAll('.s-srch-result');
        this.items = Array.from(resultNodes).map((node) => {
            var _a, _b;
            return ({
                title: (_a = node.querySelector('.s-srch-result-title')) === null || _a === void 0 ? void 0 : _a.innerHTML.replace(/\s\s/g, ' '),
                description: this.descriptionMarkupFix((_b = node.querySelectorAll('.s-srch-result-meta')[1]) === null || _b === void 0 ? void 0 : _b.innerHTML.replace(/\s\s/g, ' ')),
                link: '',
            });
        }).slice(0);
        detachedDiv.remove();
    }
}

export { LibGuidesData as L };
