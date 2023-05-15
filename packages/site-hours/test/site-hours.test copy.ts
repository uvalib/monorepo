import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import { LibraryWeeklyHours, SiteHoursSection } from '../src/index.js';
import '../src/site-hours-section.js';

describe('SiteHours', () => {
  
  it('has libraries and hours', async()=>{
    // test the snippet we gave to the home page team
    const el = await fixture<SiteHoursSection>(html`<site-hours-section limited></site-hours-section>`);
    await oneEvent(el, 'got-library-hours');
    // make sure that we have some listings
    expect(el.shadowRoot!.querySelectorAll('dd')).to.have.lengthOf.above(0);
  })

/*
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture<SiteHours>(html`<site-hours></site-hours>`);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<SiteHours>(html`<site-hours></site-hours>`);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture<SiteHours>(html`<site-hours title="attribute title"></site-hours>`);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<DataWrap>(html`<data-wrap></data-wrap>`);

    await expect(el).shadowDom.to.be.accessible();
  });
*/ 
  
});
