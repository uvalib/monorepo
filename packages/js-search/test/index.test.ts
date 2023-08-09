import { expect } from 'chai';
import { SearchLibrary } from './SearchLibrary';

describe('SearchLibrary', () => {
  it('should load index from string and perform search', async () => {
    // Setup
    const searchLib = new SearchLibrary();
    const indexString = '{"indexType": "flexsearch", "index": /* Your flexsearch index data here */, "filenames": /* Your filenames here */}';
    const query = 'Charlottesville';

    // Load index
    await searchLib.loadFromString(indexString);

    // Perform search
    const results = searchLib.performSearch(query);

    // Validate results
    expect(results).to.eql(/* Expected results here */);
  });
});
