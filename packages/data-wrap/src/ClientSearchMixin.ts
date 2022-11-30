import 'mixwith';

export const ClientSearchMixin = (superclass: any) => class extends superclass {
    #fuse: object | unknown = null;
  }