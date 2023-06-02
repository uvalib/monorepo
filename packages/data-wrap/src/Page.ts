import { GeneralSearchResult } from "./GeneralSearchResult";

export class Page extends GeneralSearchResult {

    public readonly uuid?: string;

    public readonly body?: string;

    public readonly path?: string;

    constructor(init?:Partial<Page>) {
        super(init);
    }
}

export type PageData = {
  id: any;
  attributes: {
    title: any;
    body: {
      processed: any;
    };
    path: {
      alias: any;
    };
  };
  meta: {
    excerpt: string;
  };
};

export function parse(page: PageData) {
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