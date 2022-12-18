export class Page {
    public id?: string;

    public uuid?: string;

    public title?: string;

    public body?: string;

    public description?: string;

    public path?: string;

    public link?: string;

    constructor(init?:Partial<Page>) {
        Object.assign(this, init);
    }
}

export function parse(page: { id: any; attributes: { title: any; body: { processed: any; }; path: { alias: any; }; }; meta: { excerpt: string; }; }){
    return new Page({
      id: page.id,
      uuid: page.id,
      title: page.attributes.title,
      body: page.attributes.body?.processed,
      description: page.meta && page.meta.excerpt? page.meta.excerpt.replace(/<(\/?)strong>/g,"<$1mark>"):"",
      path: page.attributes.path.alias,
      link: `http://library.virginia.edu${page.attributes.path.alias}`
    })
  }