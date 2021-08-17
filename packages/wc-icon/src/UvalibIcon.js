import { css } from 'lit-element';
import { icons, LionIcon } from '@lion/icon';

icons.addIconResolver('uvalib', (iconset, name) => {
  switch (iconset) {
    case 'alerts':
      return import(
        './alerts-iconset.js'
      ).then(module => module[name]);
    case 'brands':
      return import(
        './brands-iconset.js'
      ).then(module => module[name]);
    case 'general':
      return import(
        './general-iconset.js'
      ).then(module => module[name]);
    default:
      throw new Error(`Unknown iconset ${iconset}`);
  }
});

// Just extends the lion-icon
export class UvalibIcon extends LionIcon {
  static get styles() {
    return [
      super.styles,
      css`
:host {
  ::slotted(svg) {
    display: block;
    width: 100px !important;
    height: 100px !important;
  }
}      
      `
    ]
  }
}
