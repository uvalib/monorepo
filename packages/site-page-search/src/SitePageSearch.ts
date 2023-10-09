import { html, css, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';

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
    .header[hidden] {
      display: none;
    }
  `;

  @property({ type: Boolean, attribute: 'case-sensitive' }) caseSensitive = false;
  @property({ type: String }) query = '';
  @property({ type: String, attribute: 'query-string-param' }) queryStringParam = '';
  @property({ type: Boolean }) disabled = false;

  @query('input[type="search"]') searchInput!: HTMLInputElement;

  private currentIndex = 0;
  private results!: NodeListOf<HTMLElement>;
  private originalContent: string = '';

  get searchCount(): string {
    if (!this.results || this.results.length === 0) return '';
    return `${this.currentIndex + 1}/${this.results.length}`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.storeOriginalContent();
    this.updateQueryFromURL();
    document.addEventListener('keydown', this.handleShortcutKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleShortcutKey);
  }

  storeOriginalContent() {
    this.originalContent = this.innerHTML;
  }

  updateQueryFromURL() {
    if (this.queryStringParam) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has(this.queryStringParam)) {
        this.disabled = false;
        this.query = urlParams.get(this.queryStringParam) || '';
        this.search(this.query);

        // Adjust the currentIndex based on the anchor's position
        this.results = this.querySelectorAll('mark');
        const anchorElem = this.getAnchorElement();
        if (anchorElem) {
          const anchorIndex = Array.from(this.results).findIndex(mark => 
            anchorElem.compareDocumentPosition(mark) === Node.DOCUMENT_POSITION_FOLLOWING
          );
          if (anchorIndex !== -1) {
            this.currentIndex = anchorIndex;
            this.jumpTo();
          }
        }
      }
    }
  }

  handleShortcutKey = (e: KeyboardEvent) => {
    // Enable search
    if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
      e.preventDefault();
      this.disabled = false;
      this.mark(this.query);
      setTimeout(() => {
        this.searchInput.focus();
      }, 10);
    }
  
    // Next search result
    if ((e.metaKey || e.ctrlKey) && e.key === 'g' && !e.shiftKey) {
      e.preventDefault();
      this.handleNext();
    }
  
    // Previous search result
    if ((e.metaKey || e.ctrlKey) && e.key === 'g' && e.shiftKey) {
      e.preventDefault();
      this.handlePrev();
    }
  }

  private updateURL() {
    if (this.queryStringParam) {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      if (this.query && !this.disabled) {
        params.set(this.queryStringParam, this.query);
      } else {
        params.delete(this.queryStringParam);
      }
      url.search = params.toString();
      window.history.replaceState({}, '', url.toString());
    }
  }

  private handleInput(e: InputEvent) {
    this.query = (e.target as HTMLInputElement).value;
    this.search(this.query);
    this.updateURL();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('query')) {
      this.search(this.query);
      this.updateURL();
    }
    if (changedProperties.has('disabled')) {
      this.updateURL();
      if (this.disabled) {
        this.unmark();
      } else {
        this.mark(this.query);
      }
    }
  }

  private mark(searchTerm: string) {
    if (!searchTerm) return;
    this.innerHTML = this.originalContent;
    const tokens = searchTerm.split(/\s+/).filter(Boolean);
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

    // Adjust the currentIndex based on the anchor's position
    const anchorElem = this.getAnchorElement();
    if (anchorElem) {
        const anchorPosition = Array.from(this.children).findIndex(child => child.contains(anchorElem));
        this.currentIndex = Array.from(this.results).findIndex(mark => 
            Array.from(this.children).findIndex(child => child.contains(mark)) > anchorPosition
        );
        if (this.currentIndex === -1) this.currentIndex = 0; // If no result after anchor, start from the beginning
    }

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
      this.requestUpdate();  // Request a re-render to update the displayed count
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

  private getAnchorElement(): HTMLElement | null {
    const anchorName = window.location.hash.substring(1);
    if (!anchorName) return null;
    return this.querySelector(`[id="${anchorName}"], [name="${anchorName}"]`);
  }

  render() {
    return html`
      <div class="header" ?hidden=${this.disabled}>
        Search:
        <input type="search" .value=${this.query} @input=${this.handleInput}>
        <span>${this.searchCount}</span>
        <button @click=${this.handlePrev}>&uarr;</button>
        <button @click=${this.handleNext}>&darr;</button>
        <button @click=${() => { this.disabled = true; }}>✖</button>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    `;
  }
}
