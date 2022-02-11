import { LitElement } from 'lit';
import './UvalibAccountApp.js';
import { getAuth, signInWithCustomToken } from "firebase/auth";

const netbadgeLogin = "https://api.library.virginia.edu/fireauth/helloLib.js?dest=";
const auth = getAuth();

export class UvalibAccountAuth extends LitElement {

  static get properties() {
    return {
      statusKnown: { type: Boolean, reflect: true },
      auto: { type: Boolean, reflect: true },
      _queryParams: { type: Object, state: true },
      signedIn: { type: Boolean, reflect: true },
      signingIn: { type: Boolean, reflect: true },
      user: { type: Object },
      _fireToken: { type: String, state: true }
    };
  }

  constructor() {
    super();
    this.auto = false;
    this._queryParams = new URLSearchParams(window.location.search);
    this._fireToken = window.localStorage.getItem('UvalibAccountAuth_fireToken');
  }

  connectedCallback(){
    super.connectedCallback();
  }

  updated(changedProps) {
    if ( changedProps.has('auto') && this.auto && !this.signedIn ) this.login();
    if ( changedProps.has('_fireToken')) window.localStorage.setItem('UvalibAccountAuth_fireToken',this._fireToken);
  }

  login(){
    if ( !this.signedIn && !this.signingIn && !this._fireToken && window.location.href.indexOf('token')==-1 ) {
      console.log("Need a token...")
      window.location = netbadgeLogin+encodeURIComponent(window.location.href.split('?')[0]);
    } else if (!this.signedIn) {
      this._fbSignIn();
      console.log("Use token...");
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
          this._fireToken = null;
          this.login();
        });
    }
  }

}
