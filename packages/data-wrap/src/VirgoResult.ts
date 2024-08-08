import { GeneralSearchResult } from "./GeneralSearchResult.js";

export class VirgoResult extends GeneralSearchResult {

    public readonly author?: string[]; // List of authors for the result

    public readonly datePublished?: Date; // Date the result was published

    public readonly publicationType?: string[]; // Types of publications for the result

    public readonly format?: string[]; // Formats available for the result

    constructor(init?: Partial<VirgoResult>) {
        super(init);
    }
}
