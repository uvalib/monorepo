//import { LionButton } from '@lion/button';
import SLButton from '@shoelace-style/shoelace/dist/components/button/button.js';
import style from './UvalibButton.css.js';

export class UvalibButton extends SLButton {
  static get styles() {
    return [
      super.styles,
      style
    ]
  }
}