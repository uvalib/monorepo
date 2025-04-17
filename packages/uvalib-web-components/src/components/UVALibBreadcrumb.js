import { LitElement, html, css } from 'lit';
import { uvalibStyles } from '../styles/uvalib-styles.js';

export class UVALibBreadcrumb extends LitElement {
  static properties = {
    wrap:    { type: Boolean, reflect: true },
    rdfa:    { type: Boolean, reflect: true }
  };

  static styles = [
    uvalibStyles,
    css`
      :host { display: block; }
    `
  ];

  constructor() {
    super();
    this.wrap = false;
    this.rdfa = false;
    this._items = [];
  }

  firstUpdated() {
    const slot = this.shadowRoot.querySelector('slot');
    slot.addEventListener('slotchange', () => this._processItems());
    this._processItems();
  }

  _processItems() {
    const slot = this.shadowRoot.querySelector('slot');
    const nodes = slot.assignedNodes({ flatten: true })
      .filter(n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim()));
    this._items = nodes.map((n, i) => {
      if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'A') {
        return { text: n.textContent.trim(), href: n.getAttribute('href') };
      }
      // fallback for text or span
      return { text: n.textContent.trim(), href: null };
    });
    this.requestUpdate();
  }

  render() {
    const classes = ['uvalib-breadcrumb'];
    if (this.wrap) classes.push('uvalib-breadcrumb--wrap');
    const listAttrs = {};
    if (this.rdfa) {
      listAttrs.vocab = 'http://schema.org/';
      listAttrs['typeof'] = 'BreadcrumbList';
    }
    return html`
      <nav class="${classes.join(' ')}" aria-label="Breadcrumbs">
        <ol class="uvalib-breadcrumb__list" ...=${listAttrs}>
          ${this._items.map((item, idx) => {
            const isLast = idx === this._items.length - 1;
            const liClasses = ['uvalib-breadcrumb__list-item'];
            if (isLast) {
              liClasses.push('uvalib-current');
            }
            const meta = this.rdfa
              ? html`<meta property="position" content="${idx+1}">`
              : null;
            return html`
              <li class="${liClasses.join(' ')}"
                  ${this.rdfa?'property="itemListElement" typeof="ListItem"':''}
                  ${isLast && this.rdfa?'aria-current="page"':''}>
                ${item.href && !isLast
                  ? html`
                    <a href="${item.href}" class="uvalib-breadcrumb__link"
                       ${this.rdfa?'property="item" typeof="WebPage"':''}>
                      <span ${this.rdfa?'property="name"':''}>${item.text}</span>
                    </a>
                    ${meta}
                  `
                  : html`
                    <span ${isLast?'aria-current="page"':''}
                          ${this.rdfa?'property="name"':''}>
                      ${item.text}
                    </span>
                    ${meta}
                  `}
              </li>
            `;
          })}
        </ol>
      </nav>
      <slot style="display:none"></slot>
    `;
  }
}

customElements.define('uvalib-breadcrumb', UVALibBreadcrumb);
