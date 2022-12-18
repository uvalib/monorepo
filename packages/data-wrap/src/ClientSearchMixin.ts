import 'mixwith';

// Not currently in use, work in progress...
export const ClientSearchMixin = (superclass: any) => class extends superclass {
    #fuse: object | unknown = null;
  }