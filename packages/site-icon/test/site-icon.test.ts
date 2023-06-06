import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { SiteIcon } from '../src/SiteIcon.js';
import '../src/site-icon.js';

describe('SiteIcon', () => {
  it('has a default name as an empty string', async () => {
    const el = await fixture<SiteIcon>(html`<site-icon></site-icon>`);

    expect(el.name).to.equal('');
  });

  it('can set the name via attribute', async () => {
    const el = await fixture<SiteIcon>(html`<site-icon name="home"></site-icon>`);

    expect(el.name).to.equal('home');
  });

  it('renders SVG when valid name is given', async () => {
    const el = await fixture<SiteIcon>(html`<site-icon name="home"></site-icon>`);

    await nextFrame(); // Give it time to fetch the icon
    expect(el.shadowRoot!.querySelector('svg')).to.exist;
  });

  it('does not render SVG when invalid name is given', async () => {
    const el = await fixture<SiteIcon>(html`<site-icon name="invalid-icon-name"></site-icon>`);

    await nextFrame(); // Give it time to try to fetch the icon
    expect(el.shadowRoot!.querySelector('svg')).to.be.null;
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<SiteIcon>(html`<site-icon></site-icon>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});

function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}
