import { expect } from '@open-wc/testing';
import { LibrariesData, Library } from '../src/index.js';

describe('DataWrap', () => {
  let librariesData: LibrariesData;
  let libraries: { items: any[]; meta: any };

  beforeEach(async () => {
    librariesData = new LibrariesData();
    libraries = await librariesData.fetchData();
  });

  it('fetches libraries', async () => {
    expect(libraries.items).to.have.lengthOf.above(0);
  });

  it('fetches hours for libraries', async () => {
    await librariesData.fetchHours();
    const libList = <Library[]>libraries.items;
    expect(libList.filter((l) => l.hours)).to.have.lengthOf.above(0);
  });

  // Other tests...
});