import { LionButton } from '@lion/button';
import style from './UvalibButton.css.js';

export class UvalibButton extends LionButton {
  static get styles() {
    return [
      super.styles,
      style
    ]
  }
}