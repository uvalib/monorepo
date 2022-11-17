import { GeneralSearchResult } from './GeneralSearchResult.js';
export declare class LibGuidesData {
    #private;
    query: string;
    constructor(init: {
        query: string;
    });
    items: GeneralSearchResult[];
    fetchData(): Promise<GeneralSearchResult[]>;
}
