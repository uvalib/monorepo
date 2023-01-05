export class DHatTool {
  public id?: string;

  public title?: string;

  public description?: string;

  public link?: string;
  
  public images?: { alt: string; url: string; }[];

  public materials?: string[]

  constructor(init?:Partial<DHatTool>) {
    Object.assign(this, init);
  }
}

export function parse(tool: any){
  return new DHatTool({
    id: tool.title,
    title: tool.title,
    description: tool.Body,
    images: tool['Featured Image']? [{alt:tool['Featured Image'].alt, url:tool['Featured Image'].src}]:undefined,
    materials: tool['MAO Materials']? tool['MAO Materials'].split(','):undefined
  });
}