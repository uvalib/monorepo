import { G as GeneralData, D as Document, _ as __decorate, e, B as BentoSection, a as __classPrivateFieldSet, b as __classPrivateFieldGet, y } from './24c62c57.js';

const mlbExtrasURL = "https://mlbib.library.virginia.edu/json/extras.json";
const mlbYearsURL = "https://mlbib.library.virginia.edu/json/years.json";
class MLBib {
    //    public rawDates: any | undefined; 
    //    public async fetchHours() {
    //        if (this.hoursId) {
    //
    //        }
    //        else throw new Error(`hoursId is undefined`);
    //    }
    constructor(init) {
        Object.assign(this, init);
    }
}

// @ts-ignore
function parseMLB(mlbData) {
    //console.log(mlbData)
    return new MLBib({
        id: mlbData.id,
        title: mlbData.doc.title,
        description: mlbData.doc.plainText,
        link: (mlbData.id.match(/^\d+$/)) ?
            `https://mlbib.library.virginia.edu/year/${mlbData.id}.html` :
            `https://mlbib.library.virginia.edu/${mlbData.id}.html`
    });
}
class MLBData extends GeneralData {
    constructor(init) {
        super();
        this.searchIndex = new Document({
            document: {
                id: "id",
                index: ["plainText"],
                store: ["title", "plainText"]
            }
        });
        this.searchReady = false;
        this.items = [];
        this.ids = [];
        Object.assign(this, init);
        let indexReqs = [];
        // get the mlbExtras and add to the index
        indexReqs.push(fetch(mlbExtrasURL).then(r => r.json())
            .then(d => {
            d.forEach((element) => {
                this.searchIndex.add(element);
            });
        }));
        // get the 
        indexReqs.push(fetch(mlbYearsURL).then(r => r.json())
            .then(d => {
            d.forEach((element) => {
                this.searchIndex.add(element);
            });
        }));
        // Done loading the search index
        Promise.all(indexReqs).then(() => {
            this.searchReady = true;
            this.searchIndex.search("mark", { enrich: true });
        });
    }
    // eslint-disable-next-line class-methods-use-this
    async fetchData() {
        const that = this;
        function waitForTrue() {
            return new Promise(resolve => {
                const checkIfTrue = () => {
                    if (that.searchReady) {
                        const results = that.searchIndex.search(that.query, { enrich: true });
                        const items = results[0].result.map((res) => parseMLB(res));
                        resolve({ items, meta: {} });
                    }
                    else {
                        setTimeout(checkIfTrue, 100);
                    }
                };
                checkIfTrue();
            });
        }
        return waitForTrue();
        /*
            return new Promise(resolve => {
              const wait = setTimeout(() => {
                if (this.searchReady) {
                  const results = this.searchIndex.search(this.query, {enrich: true});
                  const items = results[0].result.map((res: any)=>parseMLB(res))
                  resolve({items: items, meta:{} });
                }
                else wait();
              }, 300);
            });
        */
        //    return fetch(hoursEndpointURL.replace("[[calIds]]",this.ids.join(',')))
        //          .then(res=>res.json())
        //          .then(hoursData=>hoursData.map((hours: Partial<MLBib> | undefined)=>parseMLB(hours)));
    }
}

var _MLBSection_mlbData;
class MLBSection extends BentoSection {
    constructor() {
        super();
        _MLBSection_mlbData.set(this, void 0);
        this.items = [];
        this.meta = { totalResults: 0 };
        this.title = "Modern Library Bibliography";
        __classPrivateFieldSet(this, _MLBSection_mlbData, new MLBData({ query: "" }), "f");
        this.limit = 5;
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (_changedProperties.has('query')) {
            this.loading = true;
            __classPrivateFieldGet(this, _MLBSection_mlbData, "f").query = this.query;
            __classPrivateFieldGet(this, _MLBSection_mlbData, "f").fetchData()
                .then((data) => {
                this.items = data.items;
                this.meta = data.meta;
                this.loading = false;
            });
        }
    }
    highlight(text) {
        const { query } = this;
        const words = query.split(" ");
        const result = { snippet: "", match: "" };
        for (let i = 0; i < words.length; i++) {
            const regex = new RegExp(`\\b${words[i]}\\b`, "i");
            const index = text.search(regex);
            if (index !== -1) {
                const startIndex = Math.max(index - 30, 0);
                const endIndex = Math.min(index + 30, text.length - 1);
                result.snippet = text.substring(startIndex, endIndex);
                result.match = words[i];
                break;
            }
        }
        if (result.snippet === "") {
            result.snippet = text.substring(0, 60);
        }
        console.log(result);
        return result.snippet;
    }
    render() {
        return y `
        <div class="bs-results--header">
        </div>

        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

            ${this.items.map(result => y `
              <li class="bs-results--list--entry">
                <a href="${result.link ? result.link : ''}" class="bento-section-title">${result.title}</a>
                ${result.description ? y `<div class="bento-section-desc">${this.highlight(result.description)}</div>` : ''}
              </li>
            `)}

            </ol>
        </div>
    `;
    }
}
_MLBSection_mlbData = new WeakMap();
__decorate([
    e({ type: Array })
], MLBSection.prototype, "items", void 0);

window.customElements.define('mlb-section', MLBSection);
