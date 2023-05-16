import { G as GeneralData, a as Document } from './ArticlesData-40bc37f5.js';
import { G as GeneralSearchResult } from './GeneralSearchResult-835c7dd8.js';

const mlbExtrasURL = "https://mlbib.library.virginia.edu/json/extras.json";
const mlbYearsURL = "https://mlbib.library.virginia.edu/json/years.json";
class MLBib extends GeneralSearchResult {
    constructor(init) {
        super(init);
    }
}

function parseMLB(mlbData) {
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
        this.initSearchIndex();
    }
    async initSearchIndex() {
        try {
            const [mlbExtras, mlbYears] = await Promise.all([
                fetch(mlbExtrasURL).then(r => r.json()),
                fetch(mlbYearsURL).then(r => r.json())
            ]);
            [...mlbExtras, ...mlbYears].forEach((element) => {
                this.searchIndex.add(element);
            });
            this.searchReady = true;
        }
        catch (error) {
            console.error("Error initializing search index:", error);
        }
    }
    async fetchData() {
        const waitForTrue = async () => {
            while (!this.searchReady) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            const results = this.searchIndex.search(this.query || '', { enrich: true });
            const items = results[0].result.map((res) => parseMLB(res));
            return { items, meta: {} };
        };
        return waitForTrue();
    }
}

export { MLBData as M, mlbYearsURL as a, MLBib as b, mlbExtrasURL as m };
