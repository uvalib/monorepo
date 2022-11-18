import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { WaitSpinner } from '../src/WaitSpinner.js';
import '../src/wait-spinner.js';

describe('WaitSpinner', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture<WaitSpinner>(html`<wait-spinner></wait-spinner>`);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<WaitSpinner>(html`<wait-spinner></wait-spinner>`);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture<WaitSpinner>(html`<wait-spinner title="attribute title"></wait-spinner>`);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<WaitSpinner>(html`<wait-spinner></wait-spinner>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
