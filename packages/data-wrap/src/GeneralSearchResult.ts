export class GeneralSearchResult { 
    public readonly id?: string | number; // Unique identifier for the result

    public readonly title?: string; // Title of the result

    public readonly description?: string; // Description of the result

    public readonly link?: string; // URL to access the result
    
    constructor(init?: Partial<GeneralSearchResult>) {
        Object.assign(this, init);
    }
}