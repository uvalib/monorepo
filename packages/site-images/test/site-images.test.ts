import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { SiteImages } from '../src/SiteImages.js';
import '../src/site-images.js';

describe('SiteImages', () => {
  it('has a default header "Hey there" and counter 5', async () => {
    const el = await fixture<SiteImages>(html`<site-images></site-images>`);

    expect(el.header).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<SiteImages>(html`<site-images></site-images>`);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the header via attribute', async () => {
    const el = await fixture<SiteImages>(html`<site-images header="attribute header"></site-images>`);

    expect(el.header).to.equal('attribute header');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<SiteImages>(html`<site-images></site-images>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
