import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { SiteAnalytics } from '../src/SiteAnalytics.js';
import '../src/site-analytics.js';
import * as sinon from 'sinon';


describe('SiteAnalytics', () => {

  // Testing default properties and attributes
  describe('Properties and Attributes', () => {
    it('has a default matomoURL "https://analytics.lib.virginia.edu/"', async () => {
      const el = await fixture<SiteAnalytics>(html`<site-analytics></site-analytics>`);
      expect(el.matomoURL).to.equal('https://analytics.lib.virginia.edu/');
    });

    it('can override the matomoURL via attribute', async () => {
      const el = await fixture<SiteAnalytics>(html`<site-analytics matomoURL="https://custom.url/"></site-analytics>`);
      expect(el.matomoURL).to.equal('https://custom.url/');
    });

    // ... other property and attribute tests ...
  });

  // Testing Matomo initialization
  describe('Matomo Initialization', () => {
    it('appends the Matomo script to the document on init', async () => {
      await fixture<SiteAnalytics>(html`<site-analytics matomoId="23"></site-analytics>`);
      const script = document.querySelector('script[src="https://analytics.lib.virginia.edu/matomo.js"]');
      expect(script).to.not.be.null;
    });
  });

  // Accessibility tests
  it('passes the a11y audit', async () => {
    const el = await fixture<SiteAnalytics>(html`<site-analytics></site-analytics>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
