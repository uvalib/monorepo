import { LitElement } from 'lit';
import './UvalibAccountAppOld.js';
import { getAuth, signInWithCustomToken } from "firebase/auth";

//const netbadgeLogin = "https://api.library.virginia.edu/fireauth/helloLib.js?dest=";
const netbadgeLogin = "https://api.library.virginia.edu/fireauth/hello.js?dest=";
const auth = getAuth();

export class UvalibAccountAuth extends LitElement {

  static get properties() {
    return {
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
    this.signedIn = false;
    this.signingIn = false;
    this._queryParams = new URLSearchParams(window.location.search);
    if (this._queryParams.has('token') ) {
      this._fireToken = this._queryParams.get('token');
    }
  }

  updated(changedProps) {
    if ( changedProps.has('auto') && this.auto && !this.signedIn && !this._fireToken && !this._queryParams.has('token')) {
      this._dispatchEvent('signingIn', {auto: true});
      this.signingIn = true;
      this.login(); 
    }
    if ( changedProps.has('_fireToken')) {
      // get rid of any token 
      this._queryParams.delete('token');
      window.history.replaceState(null, '', location.pathname + this._queryParams.toString());
      if (!this.signedIn) {
        this._dispatchEvent('signingIn', { auto: this.auto });
        this.signingIn = true;
        this.login();
      }
    }
  }

  login(){
    if ( !this.signedIn && !this._fireToken && window.location.href.indexOf('token')==-1 ) {
      console.log("Need a token...");
      window.location = netbadgeLogin+encodeURIComponent(window.location.href);
    } else if (!this.signedIn) {
      this._fbSignIn();
      console.log("Use token...");
      setTimeout(this.login.bind(this), 1000);
    } else if (this.signingIn && this.user) {
      this._signedIn();
    }
  }

  _fbSignIn() {
    if (!this.signedIn && this._fireToken) {
      signInWithCustomToken(auth, this._fireToken)
        .then((userCredential) => {
          // Signed in
          this.user = userCredential.user;
          this._signedIn();
        })
        .catch((error) => {
          console.error(`Error ${error.code} - ${error.message}`);

          this._fireToken = null;
          this.login();
        });
    }
  }

  _signedIn() {
    this.signedIn = true;
    this.signingIn = false;
    this._dispatchEvent('signedIn', { user: this.user });
  }

  _dispatchEvent(name, detail={}){
    if (name) {
      this.dispatchEvent(new CustomEvent(name, { detail: detail, bubbles: true, composed: true }));      
    }
  }

}
