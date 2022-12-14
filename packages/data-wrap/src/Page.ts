export class Page {
    public id?: string | undefined;

    public uuid?: string | undefined;

    public title: string | undefined;

    public body: string | undefined;

    public description: string | undefined;

    public path?: string | undefined;

    public link: string | undefined;

    constructor(init?:Partial<Page>) {
        Object.assign(this, init);
    }
}

export function parsePage(page: {
    meta: any;
    attributes: any; id: any; title: any; body: { processed: any; }; path: { alias: any; }; 
  }){

    return new Page({
      id: page.id,
      uuid: page.id,
      title: page.attributes.title,
      body: page.attributes.body?.processed,
      description: page.meta && page.meta.excerpt? page.meta.excerpt.replace(/<(\/?)strong>/g,"<$1mark>"):"",
      path: page.attributes.path.alias,
      link: `http://library-drupal-dev-0.internal.lib.virginia.edu:8080${page.attributes.path.alias}`
    })
  }