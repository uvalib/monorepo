import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class SitePageSearch extends LitElement {
  static styles = css`
    .header {
      padding: 10px;
      width: 100%;
      background: #eee;
      position: fixed;
      top: 0;
      left: 0;
    }
    .content {
      margin-top: 50px;
    }
  `;

  @property({ type: Boolean, attribute: 'case-sensitive' }) caseSensitive = false;
  @property({ type: String }) query = '';
  @property({ type: String, attribute: 'query-string-param' }) queryStringParam = '';

  private currentIndex = 0;
  private results!: NodeListOf<HTMLElement>;
  private originalContent: string = '';

  connectedCallback() {
    super.connectedCallback();
    // Store the original content once the component is connected to the DOM
    this.originalContent = this.innerHTML;

    // If queryStringParam is set, look for it in the URL and update the query
    if (this.queryStringParam) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has(this.queryStringParam)) {
        this.query = urlParams.get(this.queryStringParam) || '';
        this.search(this.query);
      }
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    // If the query property changes, update the search
    if (changedProperties.has('query')) {
      this.search(this.query);
    }
  }

  private mark(searchTerm: string) {
    if (!searchTerm) return;

    // Reset the content to the original content
    this.innerHTML = this.originalContent;

    const tokens = searchTerm.split(/\s+/).filter(Boolean); // Split by spaces and remove empty tokens

    tokens.forEach(token => {
        const regex = new RegExp(`(${token})`, this.caseSensitive ? 'g' : 'gi');

        const walk = (node: Node) => {
          if (node.nodeType === 3 && node.parentNode && node.parentNode.nodeName !== 'MARK') {
              const matches = Array.from(node.nodeValue!.matchAll(regex));
              if (matches.length > 0) {
                  let lastIndex = 0;
                  matches.forEach(match => {
                      const start = match.index!;
                      const end = start + match[0].length;
                      const before = node.nodeValue!.slice(lastIndex, start);
                      const marked = node.nodeValue!.slice(start, end);
                      if (before) {
                          node.parentNode!.insertBefore(document.createTextNode(before), node);
                      }
                      const markElem = document.createElement('mark');
                      markElem.textContent = marked;
                      node.parentNode!.insertBefore(markElem, node);
                      lastIndex = end;
                  });
                  const after = node.nodeValue!.slice(lastIndex);
                  if (after) {
                      node.parentNode!.insertBefore(document.createTextNode(after), node);
                  }
                  node.parentNode!.removeChild(node);
              }
          } else {
              for (let i = 0; i < node.childNodes.length; i++) {
                  walk(node.childNodes[i]);
              }
          }
        };    

        walk(this);
    });

    this.results = this.querySelectorAll('mark');
    this.currentIndex = 0;
    this.jumpTo();
    this.dispatchEvent(new CustomEvent('search-initiated'));
  }

  private unmark() {
    const marks = this.querySelectorAll('mark');
    marks.forEach(mark => {
        const parent = mark.parentNode;
        if (parent) {
            while (mark.firstChild) {
                parent.insertBefore(mark.firstChild, mark);
            }
            parent.removeChild(mark);
        }
    });
    this.dispatchEvent(new CustomEvent('search-cleared'));
  }

  private search(val: string) {
    this.unmark();
    this.mark(val);
  }

  private jumpTo() {
    if (this.results && this.results.length) {
      const current = this.results[this.currentIndex];
      this.results.forEach(mark => mark.classList.remove('current'));
      current.classList.add('current');
      current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  private handleNext() {
    if (this.results && this.results.length) {
      this.currentIndex = (this.currentIndex + 1) % this.results.length;
      this.jumpTo();
      this.dispatchEvent(new CustomEvent('search-next'));
    }
  }

  private handlePrev() {
    if (this.results && this.results.length) {
      this.currentIndex = (this.currentIndex - 1 + this.results.length) % this.results.length;
      this.jumpTo();
      this.dispatchEvent(new CustomEvent('search-prev'));
    }
  }

  render() {
    return html`
      <div class="header">
        Search:
        <input type="search" .value=${this.query} @input=${(e: InputEvent) => this.search((e.target as HTMLInputElement).value)}>
        <button @click=${this.handlePrev}>&uarr;</button>
        <button @click=${this.handleNext}>&darr;</button>
        <button @click=${this.unmark}>✖</button>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    `;
  }
}
