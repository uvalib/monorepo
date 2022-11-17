import { GeneralSearchResult } from './GeneralSearchResult.js';
import { Library } from './Library.js';
export declare class LibrariesData {
    #private;
    query: string;
    items: GeneralSearchResult[];
    libraries: Library[];
    fetchData(): Promise<Library[]>;
}
