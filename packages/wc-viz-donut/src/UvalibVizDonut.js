import { html, LitElement } from 'lit';
import style from './UvalibVizDonut.css.js';

export class UvalibVizDonut extends LitElement {
  static get styles() {
    return [style];
  }

  static get properties() {
    return {
      percent: { type: Number },
    };
  }

  constructor() {
    super();
    this.percent = 0;
  }

  render() {
    return html`
      <svg width="100%" height="100%" viewBox="0 0 42 42" class="donut" aria-labelledby="occupancy-title occupancy-desc" role="img">
        <title id="occupancy-title"><slot name="chartTitle"></slot></title>
        <desc id="occupancy-desc"><slot name="chartDesc"></slot></desc>
        <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" role="presentation"></circle>
        <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" role="presentation"></circle>    
        <circle class="donut-segment${(this.percent>=66)?" high":(this.percent>=33 && this.percent<66)?" med":""}" cx="21" cy="21" r="15.91549430918954" fill="transparent" 
          stroke-dasharray="${this.percent} ${100-this.percent}" 
          level="${this.percent} ${100-this.percent}"
          stroke-dashoffset="25" aria-labelledby="donut-segment-1-title donut-segment-1-desc">
          <title id="donut-segment-1-title"><slot name="dataTitle"></slot></title>
          <desc id="donut-segment-1-desc"><slot name="dataDesc"></slot></desc>
        </circle>
        <g class="chart-text">
          <text id="percent-occupied" class="percent-occupied chart-number" x="50%" y="50%">${this.percent}%</text>
        </g>
      </svg>
    `;
  }
}
