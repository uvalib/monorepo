import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import { SiteHoursSection } from '../src/SiteHoursSection.js';
import '../src/site-hours-section.js';

describe('SiteHoursSection', () => {
  
  it('has libraries and hours', async () => {
    const el = await fixture<SiteHoursSection>(html`<site-hours-section limited></site-hours-section>`);
    await oneEvent(el, 'got-library-hours');
    expect(el.shadowRoot!.querySelectorAll('dd')).to.have.lengthOf.above(0);
  });

  it('should have a default date', async () => {
    const el = await fixture<SiteHoursSection>(html`<site-hours-section></site-hours-section>`);
    expect(el.formattedDate).to.exist;
  });

  it('can override the placeType via attribute', async () => {
    const el = await fixture<SiteHoursSection>(html`<site-hours-section place-type="Library"></site-hours-section>`);
    expect(el.placeType).to.equal('Library');
  });

  it('should have limited flag as false by default', async () => {
    const el = await fixture<SiteHoursSection>(html`<site-hours-section></site-hours-section>`);
    expect(el.limited).to.equal(false);
  });

  it('can set the limited flag via attributes', async () => {
    const el = await fixture<SiteHoursSection>(html`<site-hours-section limited></site-hours-section>`);
    expect(el.limited).to.equal(true);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<SiteHoursSection>(html`<site-hours-section></site-hours-section>`);
    await expect(el).shadowDom.to.be.accessible();
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<SiteHoursSection>(html`<site-hours-section no-shadow-dom no-style></site-hours-section>`);
    await expect(el).to.be.accessible();
  });
  
});
