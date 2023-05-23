import './library-weekly-hours.js';

export class LibraryHoursSetup extends HTMLElement {
    
    constructor() {
        super();
      
        // Search the DOM tree for div[type="library-weekly-hours"] elements 
        // and upgrade them to <library-weekly-hours> elements
        const divs = document.querySelectorAll('div[type="library-weekly-hours"]');
        divs.forEach(div => {
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
          div.parentNode?.replaceChild(newElement, div);
        });
      }
      

  }
  