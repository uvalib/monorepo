export class DHatEvent {
  public id?: string;

  public title?: string;

  public dateStart?: number;

  public dateEnd?: number;

  public description?: string;

  public location?: string;

  public affiliatedUVA?: boolean;

  public link?: string;

  public certificate?: boolean;
  
  public images?: { alt: string; url: string; }[];

  public materials?: string[];

  public eventType?: string;

  constructor(init?:Partial<DHatEvent>) {
    Object.assign(this, init);
  }
}

export function parse(tool: any){
  return new DHatEvent({
    id: tool.title,
    title: tool.title,
    description: tool.Body,
    images: tool['Featured Image']? [{alt:tool['Featured Image'].alt, url:tool['Featured Image'].src}]:undefined,
    materials: tool['MAO Materials']? tool['MAO Materials'].split(','):undefined,
    link: `https://dh.library.virginia.edu${tool.Path}`,
    eventType: tool['Event Type']
  });
}