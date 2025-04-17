import { LitElement, html, css } from 'lit';
import { uvalibStyles } from '../styles/uvalib-styles.js';

export class UVALibPagination extends LitElement {
  static properties = {
    count: { type: Number, reflect: true },
    current: { type: Number, reflect: true },
    mode: { type: String, reflect: true } // "default" or "unbounded"
  };

  static styles = [
    uvalibStyles,
    css`
      /* Add any custom styles needed for pagination here */
      .uvalib-pagination__link[disabled] {
        pointer-events: none;
        opacity: 0.5;
      }
    `
  ];

  constructor() {
    super();
    this.count = 1;
    this.current = 1;
    this.mode = 'default';
  }

  _onPageClick(page) {
    // Prevent navigation if page is out of bounds.
    if (page < 1 || page > this.count || page === this.current) return;
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: { page },
      bubbles: true,
      composed: true
    }));
  }

  _getPages() {
    const pages = [];
    const { count, current, mode } = this;
    if (count <= 7) {
      for (let i = 1; i <= count; i++) { pages.push(i); }
      return pages;
    }
    pages.push(1);
    if (current > 3) {
      pages.push('ellipsis');
    }
    let start, end;
    if (mode === 'unbounded') {
      start = Math.max(2, current - 1);
      // In unbounded mode, show more pages after current (up to current+2)
      end = Math.min(count - 1, current + 2);
    } else {
      start = Math.max(2, current - 1);
      end = Math.min(count - 1, current + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (mode === 'unbounded') {
      if (current < count) {
        pages.push('ellipsis');
      }
    } else {
      if (current < count - 2) {
        pages.push('ellipsis');
      }
      pages.push(count);
    }
    return pages;
  }

  render() {
    const pages = this._getPages();
    const prevDisabled = this.current === 1;
    const nextDisabled = this.current === this.count;
    return html`
      <nav aria-label="Pagination" class="uvalib-pagination">
        <ul class="uvalib-pagination__list">
          <li class="uvalib-pagination__item uvalib-pagination__arrow">
            <a 
              href="javascript:void(0);" 
              class="uvalib-pagination__link uvalib-pagination__previous-page" 
              aria-label="Previous page"
              ?disabled=${prevDisabled}
              @click=${() => this._onPageClick(this.current - 1)}>
              <svg class="uvalib-icon" aria-hidden="true" role="img">
                <use href="/assets/img/sprite.svg#navigate_before"></use>
              </svg>
              <span class="uvalib-pagination__link-text">Previous</span>
            </a>
          </li>
          ${pages.map(page => page === 'ellipsis'
            ? html`
                <li class="uvalib-pagination__item uvalib-pagination__overflow" aria-label="ellipsis indicating non-visible pages">
                  <span>…</span>
                </li>
              `
            : html`
                <li class="uvalib-pagination__item uvalib-pagination__page-no">
                  <a 
                    href="javascript:void(0);" 
                    class="uvalib-pagination__button ${page === this.current ? 'uvalib-current' : ''}" 
                    aria-label="Page ${page}" 
                    ?aria-current=${page === this.current}
                    @click=${() => this._onPageClick(page)}>
                    ${page}
                  </a>
                </li>
              `)}
          <li class="uvalib-pagination__item uvalib-pagination__arrow">
            <a 
              href="javascript:void(0);" 
              class="uvalib-pagination__link uvalib-pagination__next-page" 
              aria-label="Next page"
              ?disabled=${nextDisabled}
              @click=${() => this._onPageClick(this.current + 1)}>
              <span class="uvalib-pagination__link-text">Next</span>
              <svg class="uvalib-icon" aria-hidden="true" role="img">
                <use href="/assets/img/sprite.svg#navigate_next"></use>
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    `;
  }
}

customElements.define('uvalib-pagination', UVALibPagination);
