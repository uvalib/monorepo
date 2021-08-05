import { icons, LionIcon } from '@lion/icon';

icons.addIconResolver('uvalib', (iconset, name) => {
  switch (iconset) {
    case 'alerts':
      return import(
        'https://static.lib.virginia.edu/files/icons/alerts-iconset.js'
      ).then(module => module[name]);
    case 'brands':
      return import(
        'https://static.lib.virginia.edu/files/icons/brands-iconset.js'
      ).then(module => module[name]);
    case 'general':
      return import(
        'https://static.lib.virginia.edu/files/icons/general-iconset.js'
      ).then(module => module[name]);
    default:
      throw new Error(`Unknown iconset ${iconset}`);
  }
});

// Just extends the lion-icon
export class UvalibIcon extends LionIcon {}
