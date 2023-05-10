import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { SiteSpinner } from '../src/SiteSpinner.js';
import '../src/site-spinner.js';

describe('SiteSpinner', () => {

  it('renders the default spinner (dots) when no properties are set', async () => {
    const el = await fixture<SiteSpinner>(html`<site-spinner></site-spinner>`);
    const spinnerAnimation = el.shadowRoot!.querySelector('.spinner-animation');
    expect(spinnerAnimation).to.not.be.null;
  });

  it('renders the book spinner when the "book" property is set to true', async () => {
    const el = await fixture<SiteSpinner>(html`<site-spinner .book=${true}></site-spinner>`);
    const bookSpinner = el.shadowRoot!.querySelector('.book');
    expect(bookSpinner).to.not.be.null;
  });

  it('renders the overlay when the "overlay" property is set to true', async () => {
    const el = await fixture<SiteSpinner>(html`<site-spinner .overlay=${true}></site-spinner>`);
    const overlay = el.shadowRoot!.querySelector('.v4-spinner-overlay');
    expect(overlay).to.not.be.null;
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<SiteSpinner>(html`<site-spinner></site-spinner>`);
    await expect(el).shadowDom.to.be.accessible();
  });

});
