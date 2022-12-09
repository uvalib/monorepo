export class VirgoResult {
    public id?: string;

    public title?: string;

    public description?: string;

    public link?: string;

    public author?: string[];

    constructor(init?:Partial<VirgoResult>) {
        Object.assign(this, init);
    }
}