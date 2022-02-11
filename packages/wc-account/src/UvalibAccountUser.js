import { html, css, LitElement } from 'lit';
import './UvalibAccountApp.js';
import { getAuth, signInWithCustomToken } from "firebase/auth";

const netbadgeLogin = "https://api.library.virginia.edu/fireauth/helloLib.js?dest=";
const auth = getAuth();

export class UvalibAccountUser extends LitElement {
  static get styles() {
    return css`
    `;
  }

  static get properties() {
    return {
      auto: { type: Boolean },
      userData: { type: Object },
      requestDetails: { type: Object },
      libStaff: { type: Boolean, reflect: true },
      contactInfo: { type: Boolean, reflect: true },
      signedIn: { type: Boolean, reflect: true },
      signingIn: { type: Boolean, reflect: true },
      _queryParams: { type: Object }
    };
  }

  constructor() {
    super();
    this.userData = {};
    this.requestDetails = {};
    this.auto = false;
    this._queryParams = new URLSearchParams(window.location.search);
  }

  connectedCallback(){
    super.connectedCallback();
    if (this.auto) {
      this.login();
    }
  }

  login(){
    if ( !this.signedIn && !this.signingIn && !this._fireToken && window.location.href.indexOf('token')==-1 ) {
      window.location = netbadgeLogin+encodeURIComponent(window.location.href.split('?')[0]);
    } else if (!this.signedIn) {
      this._fbSignIn();
      console.log("Attempting to sign in...");
      setTimeout(this.login.bind(this), 1000);
    }
  }

  _fbSignIn() {
    if (!this._fireToken && this._queryParams.has('token') ) {
      this._fireToken = this._queryParams.get('token');
    }

    if (!this.signedIn && this._fireToken) {
      signInWithCustomToken(auth, this._fireToken)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          this.signedIn = true;
        })
        .catch((error) => {
          console.error(`Error ${error.code} - ${error.message}`);
        });
    }
  }

  render() {
    return html`
    `;
  }
}
