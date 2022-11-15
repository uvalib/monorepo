import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { SiteFooter } from '../src/SiteFooter.js';
import '../src/site-footer.js';

describe('SiteFooter', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture<SiteFooter>(html`<site-footer></site-footer>`);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<SiteFooter>(html`<site-footer></site-footer>`);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture<SiteFooter>(html`<site-footer title="attribute title"></site-footer>`);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<SiteFooter>(html`<site-footer></site-footer>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
