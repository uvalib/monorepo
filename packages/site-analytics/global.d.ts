declare module '@uvalib/webSiteInfo/listing.js' {
  const value: {
    name: string;
    matomoSiteId?: number;
    urls?: string[];
    description?: string;
    inactive?: boolean;
    matomoDefault?: boolean;
  }[];
  export default value;
}

