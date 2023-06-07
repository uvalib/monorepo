import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { SiteButton } from '../src/SiteButton.js';
import '../src/site-button.js';
import { SiteFab } from '../src/SiteFab.js';
import '../src/site-fab.js';

describe('SiteButton', () => {

  it('has a default class of "uvalib-button"', async () => {
    const el = await fixture<SiteButton>(html`<site-button></site-button>`);
    const button = el.shadowRoot!.querySelector('button')!;

    expect(button.className).to.include('uvalib-button');
  });

  it('changes class when the `alt` property is set', async () => {
    const el = await fixture<SiteButton>(html`<site-button alt></site-button>`);
    const button = el.shadowRoot!.querySelector('button')!;

    expect(button.className).to.include('uvalib-button--alt');
  });

  // Create similar tests for the rest of the properties...
  it('changes class when the `basic` property is set', async () => {
    const el = await fixture<SiteButton>(html`<site-button basic></site-button>`);
    const button = el.shadowRoot!.querySelector('button')!;

    expect(button.className).to.include('uvalib-button--basic');
  });

  it('disables the button when the `disabled` property is set', async () => {
    const el = await fixture<SiteButton>(html`<site-button disabled></site-button>`);
    const button = el.shadowRoot!.querySelector('button')!;

    expect(button.hasAttribute('disabled')).to.be.true;
    expect(button.getAttribute('aria-disabled')).to.equal('true');
  });

  it('disables the link when the `disabled` property is set', async () => {
    const el = await fixture<SiteButton>(html`<site-button href="#" disabled></site-button>`);
    const link = el.shadowRoot!.querySelector('a')!;

    expect(link.getAttribute('disabled')).to.equal('');
    expect(link.getAttribute('aria-disabled')).to.equal('true');
  });

  it('passes the a11y audit for button', async () => {
    const el = await fixture<SiteButton>(html`<site-button></site-button>`);

    await expect(el).shadowDom.to.be.accessible();
  });

  it('passes the a11y audit for link', async () => {
    const el = await fixture<SiteButton>(html`<site-button href="#"></site-button>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});

describe('SiteFab', () => {
  it('has a default icon attribute', async () => {
    const el = await fixture<SiteFab>(html`<site-fab></site-fab>`);
    expect(el.icon).to.be.undefined;
  });

  it('changes the icon attribute when set', async () => {
    const el = await fixture<SiteFab>(html`<site-fab icon="add"></site-fab>`);
    expect(el.icon).to.equal('add');
  });

  it('renders the site-icon when the icon attribute is set', async () => {
    const el = await fixture<SiteFab>(html`<site-fab icon="add"></site-fab>`);
    const icon = el.shadowRoot!.querySelector('site-icon')!;
    expect(icon.getAttribute('name')).to.equal('add');
  });

  it('does not render the site-icon when the icon attribute is not set', async () => {
    const el = await fixture<SiteFab>(html`<site-fab></site-fab>`);
    const icon = el.shadowRoot!.querySelector('site-icon');
    expect(icon).to.be.null;
  });

  it('default fab passes the a11y audit', async () => {
    const el = await fixture<SiteFab>(html`<site-fab></site-fab>`);
    await expect(el).shadowDom.to.be.accessible();
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<SiteFab>(html`<site-fab icon="home"></site-fab>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
