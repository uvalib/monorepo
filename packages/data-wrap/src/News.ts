import { Page, PageData } from "./Page";

export class News extends Page {};

export type NewsData = PageData;

export function parse(article: NewsData) {
    return new News({
      id: article.id,
      uuid: article.id,
      title: article.attributes.title,
      body: article.attributes.body?.processed,
      description: article.meta && article.meta.excerpt? article.meta.excerpt.replace(/<(\/?)strong>/g,"<$1mark>"):"",
      path: article.attributes.path.alias,
      link: `http://library.virginia.edu${article.attributes.path.alias}`
    })
  }