export class Webpage {
    public id?: string | undefined;

    public uuid?: string | undefined;

    public title: string | undefined;

    public body: string | undefined;

    public description: string | undefined;

    public path?: string | undefined;

    public link: string | undefined;

    constructor(init?:Partial<Webpage>) {
        Object.assign(this, init);
    }
}