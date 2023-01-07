export class DHatNews {
  public id?: string;

  public title?: string;

  public description?: string;

  public link?: string;
  
  public images?: { alt: string; url: string; }[];

  constructor(init?:Partial<DHatNews>) {
    Object.assign(this, init);
  }
}

export function parse(tool: any){
  return new DHatNews({
    id: tool.title,
    title: tool.title,
    description: tool.Body,
    images: tool['Featured Image']? [{alt:tool['Featured Image'].alt, url:tool['Featured Image'].src}]:undefined,
    link: `https://dh.library.virginia.edu${tool.Path}`
  });
}