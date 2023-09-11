import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { SiteAnalytics } from '../src/SiteAnalytics.js';
import '../src/site-analytics.js';

describe('SiteAnalytics', () => {
  it('has a default matomoURL "https://analytics.lib.virginia.edu/"', async () => {
    const el = await fixture<SiteAnalytics>(html`<site-analytics></site-analytics>`);
    expect(el.matomoURL).to.equal('https://analytics.lib.virginia.edu/');
  });

  it('can override the matomoURL via attribute', async () => {
    const el = await fixture<SiteAnalytics>(html`<site-analytics matomoURL="https://custom.url/"></site-analytics>`);
    expect(el.matomoURL).to.equal('https://custom.url/');
  });

  it('has a default spa value of false', async () => {
    const el = await fixture<SiteAnalytics>(html`<site-analytics></site-analytics>`);
    expect(el.spa).to.equal(false);
  });

  it('can override the spa value via attribute', async () => {
    const el = await fixture<SiteAnalytics>(html`<site-analytics .spa=${true}></site-analytics>`);
    expect(el.spa).to.equal(true);
  });

  it('has a default variables value of null', async () => {
    const el = await fixture<SiteAnalytics>(html`<site-analytics></site-analytics>`);
    expect(el.variables).to.equal(null);
  });

  it('can set variables via attribute', async () => {
    const el = await fixture<SiteAnalytics>(html`<site-analytics .variables=${{"1":"foo", "2":"bar"}}></site-analytics>`);
    expect(el.variables).to.deep.equal({"1":"foo", "2":"bar"});
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<SiteAnalytics>(html`<site-analytics></site-analytics>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
