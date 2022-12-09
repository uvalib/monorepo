export class VirgoResult {
    public id?: string;

    public title?: string;

    public description?: string;

    public link?: string;

    public author?: string[];

    public datePublished?: Date;

    constructor(init?:Partial<VirgoResult>) {
        Object.assign(this, init);
    }
}