var _DHAtUVAData_instances, _DHAtUVAData_parseData;
import { __classPrivateFieldGet } from "tslib";
export class DHAtUVAData {
    constructor() {
        _DHAtUVAData_instances.add(this);
        this.nodes = [];
        this.edges = [];
    }
    async fetchData() {
        // This should be fetched live from the site under normal conditions
        const data = await import('./data/graph-data-api.js');
        __classPrivateFieldGet(this, _DHAtUVAData_instances, "m", _DHAtUVAData_parseData).call(this, data.default.DHData);
        return data.default;
    }
}
_DHAtUVAData_instances = new WeakSet(), _DHAtUVAData_parseData = function _DHAtUVAData_parseData(data) {
    const techApps = new Set();
    data.nodes.forEach(n => {
        if (n.node['Content Type'] === "Projects" && n.node['Project URL']) {
            const id = n.node['Project URL'];
            const tas = n.node['Technical Approach'];
            if (tas) {
                tas.split(",").forEach(ta => {
                    if (ta && !techApps.has(ta)) {
                        techApps.add(ta);
                        // push Tech Approach onto the stack
                        this.nodes.push({ id: ta, desc: ta, type: 'image', img: 'https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/book.svg', size: [15, 15] });
                    }
                    // push tech app -> project edge
                    this.edges.push({ source: id, target: ta, desc: "Technical Approach" });
                });
            }
            // push project onto the stack
            this.nodes.push({ id, type: 'image', img: 'https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/gear.svg', size: [20, 20] });
        }
        else if (n.node['Content Type'] === "People") {
            const id = n.node.Name;
            // push person onto the stack
            this.nodes.push({ id, type: 'image', img: 'https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/person.svg', size: [15, 20] });
            // create edges for this person
            data.nodes.filter(node => node.node.Instructor === id).forEach(node => {
                this.edges.push({ source: id, target: node.node['I am connected to:'], desc: node.node['My connection type is:'] });
            });
        }
        else if (n.node['Content Type'] === "Tools") {
            const id = n.node.title;
            this.nodes.push({ id, type: 'image', img: 'https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/screwdriver-wrench.svg', size: [15, 15] });
        }
        else if (n.node['Content Type'] === "Organizations") {
            const id = n.node.title;
            this.nodes.push({ id, type: 'image', img: 'https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/building-columns.svg', size: [15, 15] });
        }
    });
};
//# sourceMappingURL=DHAtUVAData.js.map