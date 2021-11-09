import { c as css, L as LitElement, h as html } from './lit-element-b0aa61ba.js';

var style = css`
@import url("https://use.typekit.net/tgy5tlj.css");:host{background-color:#f1f1f1;display:block;padding-bottom:.75em}a{color:inherit;display:block;margin:20px 0;text-decoration:none}a:hover{text-decoration:underline}.category{display:none}:host([featured])>a{border-bottom:1px solid #dadada;padding-bottom:24px}:host([featured])>a:last-of-type{border-bottom:none}:host([featured]) .category{border:1px solid #dadada;display:inline-block;font-size:11px;font-weight:700;padding:6px 20px 7px}:host([featured]) .headline{display:block;margin:20px 0}#content h4{background-color:#232d4b;color:#fff;margin-bottom:0;margin-top:0;padding:.75em}#content ul{list-style:none;margin-left:0}::slotted(li){font-size:1.15em;text-indent:-1em}
/*# sourceMappingURL=src/UvalibSubNav.css.map */
`;

class UvalibSubNav extends LitElement {
  static get styles() {
    return [style];
  }

  static get properties() {
    return {
      title: { type: String },
    };
  }

  render() {
    return html`
      <div id="content">
        <h4>${this.title}</h4>
        <ul>
          <slot></slot>
        </ul>
      </div>
    `;
  }
}

export { UvalibSubNav };
