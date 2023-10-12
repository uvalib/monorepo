// Import necessary libraries/modules
import { LitElement, css, html, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import G6 from '@antv/g6';

export class VizGraph extends LitElement {

  // Define properties for the VizGraph component
  @property({ type: Object }) graph: any;
  @property({ type: Array }) nodes: any;
  @property({ type: Array }) edges: any;
  @property({ type: String }) layout = "force";
  @property({ type: Boolean }) overlap = true;

  // CSS styles for the component
  static override styles = css`
    :host {
      display: block;
    }
    .tooltip {
      background-color: white;
      border-radius: 15px;
      border: 2px solid #73AD21;
      padding: 10px;
    }
  `;

  // Update function that listens for changes to data and triggers graph rendering
  override update(changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>) {
    this.__renderGraph();
    super.update(changedProperties);
  }

  // Render or update the graph
  __renderGraph() {
    if (this.graph) {
      const graphData = { nodes: this.nodes, edges: this.edges };
      this.graph.updateLayout({
        type: this.layout,
        preventOverlap: !this.overlap
      });
      this.graph.data(graphData);
      this.graph.render();
      // Fit the graph view after layout
      this.graph.on("afterlayout", () => this.graph!.fitView());
    }
  }

  // Define the component render output
  override render() {
    return html`<div id="container"></div>`;
  }

  // Initialize the graph once the component is first updated in the DOM
  override firstUpdated(changedProps: PropertyValueMap<unknown> | Map<PropertyKey, unknown>) {
    super.firstUpdated(changedProps);
    
    const container = this.shadowRoot?.getElementById("container");
    if (container) {
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;

      // Create and configure tooltip for the graph
      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        itemTypes: ['node', 'edge'],
        getContent: (e) => {
          const outDiv = document.createElement('div');
          outDiv.style.width = 'fit-content';
          if (e && e.item) {
            outDiv.innerHTML = `
              <div class="tooltip">
                ${e.item.getModel().desc || e.item.getModel().label || e.item.getModel().id }
              </div>
            `;
          }
          return outDiv;
        },
        // Define rules for when tooltip should appear
        shouldBegin: (e) => {
          if (!e || !e.item) return true;
          
          const itemId = e.item.getModel().id;
          switch (itemId) {
            case '1':
              return false;
            case '2':
              return e.target.get('name') === 'text-shape';
            case '3':
              return e.target.get('name') !== 'text-shape';
            default:
              return true;
          }
        },
      });

      // Initialize the graph with configuration and tooltip
      this.graph = new G6.Graph({
        container: container,
        width: width,
        height: height,
        layout: {
          type: this.layout,
          preventOverlap: !this.overlap,
          nodeSize: 20,
        },
        plugins: [tooltip],
        modes: {
          default: ['drag-node', "zoom-canvas", 'drag-canvas', 'activate-relations'],
        },
        defaultNode: {
          size: 20,
        },
        defaultEdge: {
          style: {
            stroke: "#e2e2e2"
          }
        }
      });

      // Render the graph if nodes or edges are available
      if (this.nodes || this.edges) this.__renderGraph();
    }
  }
}
