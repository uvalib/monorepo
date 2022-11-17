import { GeneralSearchResult } from './GeneralSearchResult.js';
export declare class VirgoData {
    items: GeneralSearchResult[];
    fetchData(): Promise<GeneralSearchResult[]>;
}
