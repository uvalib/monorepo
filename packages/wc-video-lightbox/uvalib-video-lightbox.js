import {LitElement, html, css} from 'lit';
import '@spectrum-web-components/dialog/sp-dialog-wrapper.js';
import '@spectrum-web-components/overlay/overlay-trigger.js';
import '@spectrum-web-components/theme/theme-darkest.js';
import '@spectrum-web-components/theme/scale-large.js';
import '@spectrum-web-components/theme/sp-theme.js';

/**
 * A simple Video Lightbox
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class UVAVideoLightbox extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  static get properties() {
    return {
      youtubeId: {type: String},
      youtubePlaylistId: {type: String},
      videoWidth: {type: Number},
      videoHeight: {type: Number},
      title: {type: String}
    };
  }

  constructor() {
    super();
    this.videoWidth = 640;
    this.videoHeight = 360;
    this.youtubeListType = "";
  }

  render() {
    return html`
    <sp-theme color="darkest" scale="large">
    <div>
      <overlay-trigger type="modal" placement="none">
          <sp-dialog-wrapper
              slot="click-content"
              headline="${this.title}"
              dismissable
              underlay
          >

          <iframe id="ytplayer" type="text/html" width="${this.videoWidth}" height="${this.videoHeight}"
  src="${this.youtubePlaylistId?`https://www.youtube.com/embed?listType=playlist&list=${this.youtubePlaylistId}&autoplay=1&origin=${window.location.origin}&rel=0`:`https://www.youtube.com/embed/${this.youtubeId}?autoplay=1&origin=${window.location.origin}&rel=0`}"
  frameborder="0"></iframe>
              
          </sp-dialog-wrapper>
          <div slot="trigger" variant="primary"><slot></slot></div>
      </overlay-trigger>
    </div>
    </sp-theme>      
    `;
  }

  _onClick() {
    this.count++;
  }
}

window.customElements.define('uvalib-video-lightbox', UVAVideoLightbox);
