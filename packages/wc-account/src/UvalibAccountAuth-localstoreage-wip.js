import { LitElement } from 'lit';
import './UvalibAccountAppOld.js';
import { getAuth, signInWithCustomToken } from "firebase/auth";

const netbadgeLogin = "https://api.library.virginia.edu/fireauth/helloLib.js?dest=";
const auth = getAuth();

export class UvalibAccountAuth extends LitElement {

  static get properties() {
    return {
      statusKnown: { type: Boolean, reflect: true },
      /* when `auto` is true login will be attempted without being prompted  */
      auto: { type: Boolean, reflect: true },
      /* used internally to track query parameters in url */
      _queryParams: { type: Object, state: true },
      /* true when signed in */
      signedIn: { type: Boolean, reflect: true },
      /* true when signing in */
      signingIn: { type: Boolean, reflect: true },
      /* The currently-authenticated user with user-related metadata. */
      user: { type: Object },
      /* used internally to store the auth token */
      _fireToken: { type: String, state: true }
    };
  }

  constructor() {
    super();
    this.auto = false;
    this._queryParams = new URLSearchParams(window.location.search);
//    this.signingIn = window.localStorage.getItem('UvalibAccountAuth_signingIn');
//    this.signedIn = window.localStorage.getItem('UvalibAccountAuth_signedIn');
//    console.log('setting signedIn in constructor '+this.signedIn);
    this._fireToken = window.localStorage.getItem('UvalibAccountAuth_fireToken');
    if (!this.auto && this._queryParams.has('token') ) this._fbSignIn();
  }

  connectedCallback(){
    super.connectedCallback();
    window.addEventListener('storage', this._localstorageChange.bind(this));
  }

  disconnectedCallback(){
    super.disconnectedCallback();
    window.removeEventListener('storage', this._localstorageChange.bind(this));
  }

  _localstorageChange(e){
    if (e.key == 'UvalibAccountAuth_fireToken' && e.newValue != this._fireToken ) {
      this._fireToken = e.newValue;
//    } else if (e.key == 'UvalibAccountAuth_signedIn' && e.newValue != this.signedIn ) {
//      this.login();
//    } else if (e.key == 'UvalibAccountAuth_signingIn' && e.newValue != this.signingIn ) {
//      this.signingIn = e.newValue;
    }
  }

  updated(changedProps) {
    if ( changedProps.has('auto') && this.auto && !this.user ) this.login();
    if ( changedProps.has('_fireToken') && this._fireToken) window.localStorage.setItem('UvalibAccountAuth_fireToken',this._fireToken);
//    if ( changedProps.has('signedIn') && this.signedIn != null) window.localStorage.setItem('UvalibAccountAuth_signedIn',this.signedIn);
//    if ( changedProps.has('singingIn') && this.signingIn != null) window.localStorage.setItem('UvalibAccountAuth_signingIn',this.signingIn);
  }

  login(){
    if ( !this.signedIn && !this._fireToken && window.location.href.indexOf('token')==-1 ) {
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
      this._queryParams.delete('token');
      window.history.replaceState(null, '', location.pathname + this._queryParams.toString());
    }

    console.log('fb token:');
    console.log(this._fireToken);

    if (!this.signedIn && this._fireToken) {
      signInWithCustomToken(auth, this._fireToken)
        .then((userCredential) => {
          // Signed in
          this.user = userCredential.user;
          console.log(user);
//          this.signedIn = true;
//          console.log('setting signedIn in firebase auth success '+this.signedIn);
        })
        .catch((error) => {
          console.error(`Error ${error.code} - ${error.message}`);
          this._fireToken = null;
          this.signedIn = false;
          console.log('setting signedIn in firebase auth error '+this.signedIn);
          this.login();
        });
    }
  }

}
