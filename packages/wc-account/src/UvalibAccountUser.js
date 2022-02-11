import { LitElement } from 'lit';
import { UvalibAccountAuth } from './UvalibAccountAuth.js';

export class UvalibAccountUser extends UvalibAccountAuth {

  static get properties() {
    return {...super.properties, ...{
      userData: { type: Object },
      requestDetails: { type: Object },
      libStaff: { type: Boolean, reflect: true },
      contactInfo: { type: Boolean, reflect: true },
    }};
  }

  constructor() {
    super();
  }

  connectedCallback(){
    super.connectedCallback();
  }

}
