import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { DataWrap, LibrariesData, Library } from '../src/index.js';
import '../src/data-wrap.js';

describe('DataWrap', () => {

  it('has libraries with hours in the reulsts', async()=>{
    const librariesData = new LibrariesData();
    const libraries = await librariesData.fetchData();
    // we should have some libraries returned
    expect(libraries.items).to.have.lengthOf.above(0);

    await librariesData.fetchHours();
    // some libraries should have some hours attached
    const libList = <Library[]>libraries.items; 
    expect(libList.filter(l=>(l.hours))).to.have.lengthOf.above(0);   
  });
/*
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture<DataWrap>(html`<data-wrap></data-wrap>`);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<DataWrap>(html`<data-wrap></data-wrap>`);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture<DataWrap>(html`<data-wrap title="attribute title"></data-wrap>`);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<DataWrap>(html`<data-wrap></data-wrap>`);

    await expect(el).shadowDom.to.be.accessible();
  });
*/  
});
