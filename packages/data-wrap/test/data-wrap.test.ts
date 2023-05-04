import { expect } from '@open-wc/testing';
import { LibrariesData, Library, ArticlesData, CatalogData } from '../src/index.js';

describe('DataWrap', () => {
  let librariesData: LibrariesData;
  let libraries: { items: any[]; meta: any };
  let articlesData: ArticlesData;
  let catalogData: CatalogData;

  beforeEach(async () => {
    librariesData = new LibrariesData();
    libraries = await librariesData.fetchData();
    articlesData = new ArticlesData({query:"foot",limit:10});
    catalogData = new CatalogData({query:"football",limit:8});
  });

  // ensure that we are able to get library results
  it('fetches libraries', () => {
    expect(libraries.items).to.have.lengthOf.above(0);
    console.log(`Found ${libraries.items.length} libraries!`);
  });

  // ensure that we are able to get hours for the library results
  it('fetches hours for libraries', async () => {
    console.log('Running fetches hours for libraries test');
    await librariesData.fetchHours();
    const libList = <Library[]>libraries.items;
    expect(libList.filter((l) => l.hours)).to.have.lengthOf.above(0);
  });

  // ensure that we can fetch some Article results
  it('fetches articles from Virgo', async function() {
    console.log('Running fetches articles from Virgo test');
    this.timeout(15000)
    await articlesData.fetchData();
    expect(articlesData.items).to.have.lengthOf.above(0);
    expect(articlesData.items).to.have.lengthOf(10);
    console.log(`returned ${articlesData.items.length} articles from "foot" search`);
  });

  it('fetches catalog results from Virgo', async function() {
    console.log('Running fetches catalog results from Virgo test'); // Add console log
    this.timeout(15000);
    await catalogData.fetchData();
    expect(catalogData.items).to.have.lengthOf.above(0);
    expect(catalogData.items).to.have.lengthOf(8);
  });

  // Other tests...
});
