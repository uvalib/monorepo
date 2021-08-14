import { html, css, LitElement } from 'lit-element';
import style from './UvalibButton.css.js';

export class UvalibButton extends LitElement {
  static get styles() {
    return [style,css`
      :host {
        display: block;
      }
    `];
  }

  static get properties() {
    return {
      mode: {type: String},
      role: {type: String},
      url: {type: String}
    };
  }

  _makeClass(mode){
    return  `${(this.mode==='text')?
              'text-button ':
              (this.mode==='icon')?
                'icon-button ':
                (this.mode==='link')?
                  'link-button ':''}` + 
            `${(this.mode!='text' && this.mode!='icon' && this.mode!='link')?
              'pure-button ':''}` +
            `${(this.mode==='primary')?
              'pure-button-primary ':
              (this.mode==='small')?
                'pure-button-small ':
                (this.mode==='tertiary')?
                  'pure-button-tertiary ':''}`;
  }

  _clicked(e){
    e.preventDefault();
    e.stopPropagation();
    if ( this.mode == 'link' && this.url != "") {
      window.location.href = this.url
    }
    this.dispatchEvent(new CustomEvent('click'));
  }

  _escClicked(e){
    e.preventDefault();
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('esc'));
  }

  render() {
    return html`
    <button tabindex="0" role="${this.role}" 
      class="v4-button ${this._makeClass(this.mode)}"
        @click="${this._clicked}" 
        @keydown="${(e)=>{
          if(e.key === 'Enter') this._clicked(e);
          if(e.key === ' ') this._clicked(e);
        }}"
        @keyup="${(e)=>{
          if(e.key === 'Escape') this._escClicked(e);
        }}">
        <slot></slot>
    </button>
    `;
  }
}
