import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential, signOut, Auth, User } from 'firebase/auth';

import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';

@customElement('firebase-auth')
export class FirebaseAuth extends LitElement {

  @property({ type: Object }) config?: any;

  @state() private user: User | null = null;
  private auth: Auth | undefined;
  private firebaseApp: FirebaseApp | undefined;

  static styles = css`

  `;

  firstUpdated() {
    this.maybeInitializeFirebase();
  }

  private maybeInitializeFirebase() {
    if (this.config) {
      if (!this.firebaseApp) {
        console.log('Initializing Firebase Auth');
        this.firebaseApp = initializeApp(this.config);
      }
      console.log('Firebase App initialized');      
      this.auth = getAuth(this.firebaseApp);

      this.auth.onAuthStateChanged((user) => {
        this.user = user;
        this.dispatchEvent(new CustomEvent('auth-changed', { detail: { user } }));
      });
    }
  }

  render() {
    return html`
      ${!this.user ? html`
        <md-filled-button @click=${this.handleLogin}>Log In</md-filled-button>  
      ` : html`
        <md-outlined-button @click=${this.handleLogout}>Log Out</md-outlined-button>
      `}
    `;
  }

  private handleLogin() {
    if (!this.auth) {
      console.log("Firebase Auth not initialized");
      this.maybeInitializeFirebase();
    }

    chrome.identity.getAuthToken({ 'interactive': true, 'scopes': ['openid', 'email', 'profile'] }, (token) => {
      if (chrome.runtime.lastError || !token) {
        console.error('Failed to obtain token:', chrome.runtime.lastError);
        this.dispatchEvent(new CustomEvent('login-error', { detail: { error: chrome.runtime.lastError } }));
      } else if (this.auth) {
        const credential = GoogleAuthProvider.credential(null, token);
        signInWithCredential(this.auth, credential)
          .then((result) => {
            this.dispatchEvent(new CustomEvent('login-success', { detail: { user: result.user } }));
          })
          .catch((error) => {
            console.error('Error signing in with Firebase', error);
            this.dispatchEvent(new CustomEvent('login-error', { detail: { error } }));
          });
      }
    });
  }

  private handleLogout() {
    if (!this.auth) {
      console.error("Firebase Auth not initialized");
      return;
    }

    signOut(this.auth).then(() => {
      this.dispatchEvent(new CustomEvent('logout-success'));
    }).catch((error) => {
      console.error('Error signing out', error);
      this.dispatchEvent(new CustomEvent('logout-error', { detail: { error } }));
    });
  }
}
