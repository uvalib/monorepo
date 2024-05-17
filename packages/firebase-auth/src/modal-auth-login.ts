import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import '@material/web/button/filled-button.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';
import './auth-ui-login.js';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

@customElement('modal-auth-login')
export class ModalAuthLogin extends LitElement {
  @property({ type: Object }) user: User | null = null;
  @property({ type: Object }) firebaseConfig?: FirebaseConfig;

  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('firebaseConfig') && this.firebaseConfig) {
      this.initializeFirebase();
    }
  }

  initializeFirebase() {
    if (this.firebaseConfig) {
      this.app = initializeApp(this.firebaseConfig);
      this.auth = getAuth(this.app);
      onAuthStateChanged(this.auth, (user) => {
        this.user = user;
        this.requestUpdate();
      });
    }
  }

  openDialog() {
    this.shadowRoot?.querySelector<HTMLDialogElement>('#auth-dialog')?.showModal();
  }

  closeDialog() {
    this.shadowRoot?.querySelector<HTMLDialogElement>('#auth-dialog')?.close();
  }

  async logout() {
    if (this.auth) {
      try {
        await signOut(this.auth);
        console.log('User signed out successfully');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  }

  render() {
    return html`
      ${this.user
        ? html`
        <md-icon-button aria-label="User" @click="${this.logout}">
            <md-icon>account_circle</md-icon>
        </md-icon-button>`
        : html`<md-filled-button @click="${this.openDialog}">Sign In</md-filled-button>`}
      <dialog id="auth-dialog">
        <auth-ui-login .firebaseConfig="${this.firebaseConfig}" @auth-success="${this.closeDialog}"></auth-ui-login>
        <md-filled-button @click="${this.closeDialog}">Close</md-filled-button>
      </dialog>
    `;
  }
}