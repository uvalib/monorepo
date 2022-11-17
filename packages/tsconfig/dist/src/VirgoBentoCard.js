var _VirgoBentoCard_virgoData;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { VirgoData } from '@uvalib/data-wrap';
import { BentoCard } from './BentoCard.js';
export class VirgoBentoCard extends BentoCard {
    constructor() {
        super();
        _VirgoBentoCard_virgoData.set(this, void 0);
        this.title = "Virgo";
        __classPrivateFieldSet(this, _VirgoBentoCard_virgoData, new VirgoData(), "f");
    }
    updated(_changedProperties) {
        if (_changedProperties.has('keyword')) {
            __classPrivateFieldGet(this, _VirgoBentoCard_virgoData, "f").fetchData()
                .then((data) => { this.items = data; });
        }
    }
}
_VirgoBentoCard_virgoData = new WeakMap();
//# sourceMappingURL=VirgoBentoCard.js.map