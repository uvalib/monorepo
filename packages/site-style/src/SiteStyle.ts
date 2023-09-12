/* eslint-disable import/no-extraneous-dependencies */
import { html, LitElement, render } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property } from 'lit/decorators.js';
import { LibraryColors } from './LibraryColors.js';
import { LibraryVariables } from './SiteStyleVariables.js';
import { W3CSS } from './SiteStyleW3.js';
import { LibraryMain } from './SiteStyleMain.js';

export class SiteStyle extends LitElement {

  @property({ type: Boolean, attribute: "no-shadow-dom" }) noShadowDom = false;  // default is to have a shadowDom

  @property({ type: Boolean, attribute: "no-style" }) noStyle = false; // default to have default styles applied

  @property({ type: Object }) imports: {[key: string]: string} = {};

  @property({ type: String }) importedStyles: string = "";

  @property({ type: String }) rootLinkDomain: string = "https://www.library.virginia.edu";

  // many web components have headings embedded within a children and shadowdom, this parameter should control where to start a heading level in those comonents depending on where they are used.
  @property({ type: Number }) headingLevelStart: number = 2;

  #styleNode: HTMLElement|null = null;

  private _resizeController: any;

  // Use ResizeObserver to make this.offsetWidth and this.offsetHeight reactive
  // lazy loaded as this isn't used that often
  // see https://lit.dev/blog/2022-01-05-lit-2.1-release/ 
  protected resizeReactive() {
    import('@lit-labs/observers/resize_controller.js').then(({ResizeController})=>{
      this._resizeController = new ResizeController(this,{});
    })
  }

  static get styles() {
    // need to figure out how to dynamically load these (or not)
    return [
      LibraryColors, LibraryVariables, W3CSS, LibraryMain
    ];
  }

  protected firstUpdated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (this.imports && !this.noStyle) {
      Object.keys(this.imports).forEach(key=>{
        if (this.imports[key]) {
          const imp: string = this.imports[key];
          import(imp).then(css=>{
            this.importedStyles += css.default.toString().replace(/:host/,key.toLowerCase());
          } )
        }
      });
    }      
  }


  connectedCallback(): void {
    super.connectedCallback();    
    if (this.noShadowDom && !this.noStyle) {
      // this is such a hack, pushing water uphill...
      this.#styleNode = document.createElement('style');
      this.appendChild(this.#styleNode); 
      render(html`${ Object.getPrototypeOf(this).constructor.styles.map((s: { toString: () => any; }) => s.toString().replace(/:host/m,this.tagName.toLowerCase() ) ) }`,this.#styleNode);
    }
  }

  createRenderRoot() {
    if (this.noShadowDom) {
      return this;
    }
    return super.createRenderRoot();
  }

  render() {
    return html`
      ${this.noShadowDom?'':html`<slot></slot>`}
    `;
  }
}
