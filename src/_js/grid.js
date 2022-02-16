import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-column-group.js';
import '@vaadin/grid/vaadin-grid-filter-column.js';
import '@vaadin/grid/vaadin-grid-selection-column.js';
import '@vaadin/grid/vaadin-grid-sort-column.js';
import '@vaadin/grid/vaadin-grid-tree-column.js';

import {LitElement, css, html} from 'lit';

export class MLBGrid extends LitElement {
  static properties = {
    items: {type:Object},
  };
  // Define scoped styles right with your component, in plain CSS
  static styles = css`
  `;

  constructor() {
    super();
    // Declare reactive properties
    this.items = [];
  }

  // Render the UI as a function of component state
  render() {
    return html`
    <vaadin-grid .items="${this.items}" theme="row-stripes" column-reordering-allowed multi-sort>
        <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
        <vaadin-grid-sort-column width="5em" path="yearId" header="Year"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column width="9em" path="METADATA.TITLE" header="Title"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column width="9em" flex-grow="2" path="METADATA.AUTHOR" header="Author"></vaadin-grid-column>
    </vaadin-grid>    
    `;
  }
}
customElements.define('mlb-grid', MLBGrid);