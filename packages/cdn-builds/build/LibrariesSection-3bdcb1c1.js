import { a as __classPrivateFieldSet, b as __classPrivateFieldGet, x } from './query-assigned-elements-66a11629.js';
import './ArticlesData-9f3aa85f.js';
import { a as LibrariesData } from './LibrariesData-a59266c8.js';
import { B as BentoSection } from './BentoSection-4119efbf.js';

var _LibrariesSection_librariesData;
function renderBriefItem(item) {
    return x `  
      ${item.link ? x `
        <div class="bento-section-title"><a href="${item.link}">${item.title}</a></div>
      ` : x `
        <div class="bento-section-title"><a href="http://library.virginia.edu/hours#${item.slug}">${item.title}</a></div>
      `}
      <div class="bento-section-desc"><!-- put todays hours here --></div>
    `;
}
class LibrariesSection extends BentoSection {
    constructor() {
        super();
        _LibrariesSection_librariesData.set(this, void 0);
        this.title = "Libraries";
        __classPrivateFieldSet(this, _LibrariesSection_librariesData, new LibrariesData(), "f");
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (_changedProperties.has('query')) {
            this.loading = true;
            __classPrivateFieldGet(this, _LibrariesSection_librariesData, "f").query = this.query;
            __classPrivateFieldGet(this, _LibrariesSection_librariesData, "f").fetchData().then(() => {
                this.items = __classPrivateFieldGet(this, _LibrariesSection_librariesData, "f").items;
                this.loading = false;
            });
        }
    }
    // eslint-disable-next-line class-methods-use-this
    renderBriefItem(item) {
        return renderBriefItem(item);
    }
}
_LibrariesSection_librariesData = new WeakMap();

export { LibrariesSection as L, renderBriefItem as r };
