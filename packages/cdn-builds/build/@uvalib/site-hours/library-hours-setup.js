import '../../library-weekly-hours-d28c019e.js';
import '../../query-assigned-elements-66a11629.js';
import '../../SiteStyle-5d4bc111.js';
import '../../ArticlesData-9f3aa85f.js';
import '../../LibrariesData-a59266c8.js';
import '../../GeneralSearchResult-835c7dd8.js';
import '../../utils-d8868732.js';

class LibraryHoursSetup extends HTMLElement {
    constructor() {
        super();
        // Search the DOM tree for div[type="library-weekly-hours"] elements 
        // and upgrade them to <library-weekly-hours> elements
        const divs = document.querySelectorAll('div[type="library-weekly-hours"]');
        divs.forEach(div => {
            var _a;
            const newElement = document.createElement('library-weekly-hours');
            // Copy all attributes from the div to the new element (except for 'type')
            for (let i = 0; i < div.attributes.length; i++) {
                const attr = div.attributes.item(i);
                if (attr && attr.name !== 'type') {
                    newElement.setAttribute(attr.name, attr.value);
                }
            }
            // Move all child nodes from the div to the new element
            while (div.firstChild) {
                newElement.appendChild(div.firstChild);
            }
            // Replace the div with the new element
            (_a = div.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(newElement, div);
        });
    }
}

// Register the custom element
window.customElements.define('library-hours-setup', LibraryHoursSetup);
