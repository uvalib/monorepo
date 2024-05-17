import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import '@material/web/button/filled-button.js';
import '@material/web/textfield/filled-text-field.js';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

@customElement('auth-ui-login')
export class AuthUILogin extends LitElement {
  @property({ type: Object }) user: User | null = null;
  @property({ type: String }) errorMessage = '';
  @property({ type: Boolean }) isSignUp = false;
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

  async handleSignUp(event: Event) {
    event.preventDefault();
    const emailInput = this.shadowRoot?.querySelector<HTMLInputElement>('#sign-up-email');
    const passwordInput = this.shadowRoot?.querySelector<HTMLInputElement>('#sign-up-password');

    if (emailInput && passwordInput && this.auth) {
      const email = emailInput.value;
      const password = passwordInput.value;
      try {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        this.user = userCredential.user;
        this.dispatchEvent(new CustomEvent('auth-success', { detail: userCredential }));
      } catch (error: any) {
        this.errorMessage = error.message;
      }
    }
  }

  async handleSignIn(event: Event) {
    event.preventDefault();
    const emailInput = this.shadowRoot?.querySelector<HTMLInputElement>('#sign-in-email');
    const passwordInput = this.shadowRoot?.querySelector<HTMLInputElement>('#sign-in-password');

    if (emailInput && passwordInput && this.auth) {
      const email = emailInput.value;
      const password = passwordInput.value;
      try {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        this.user = userCredential.user;
        this.dispatchEvent(new CustomEvent('auth-success', { detail: userCredential }));
      } catch (error: any) {
        this.errorMessage = error.message;
      }
    }
  }

  toggleForm() {
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';
  }

  render() {
    return html`
      ${this.user
        ? html`<p>Welcome, ${this.user.email}</p>`
        : html`
          <div>
            ${this.isSignUp
              ? html`
                <h2>Create Account</h2>
                <form @submit="${this.handleSignUp}">
                  <md-filled-text-field id="sign-up-email" label="Email" type="email" required></md-filled-text-field>
                  <md-filled-text-field id="sign-up-password" label="Password" type="password" required></md-filled-text-field>
                  <md-filled-button type="submit">Sign Up</md-filled-button>
                  <p>Already have an account? <a href="#" @click="${this.toggleForm}">Sign In</a></p>
                </form>
              `
              : html`
                <h2>Sign In</h2>
                <form @submit="${this.handleSignIn}">
                  <md-filled-text-field id="sign-in-email" label="Email" type="email" required></md-filled-text-field>
                  <md-filled-text-field id="sign-in-password" label="Password" type="password" required></md-filled-text-field>
                  <md-filled-button type="submit">Sign In</md-filled-button>
                  <p>Don't have an account? <a href="#" @click="${this.toggleForm}">Create Account</a></p>
                </form>
              `}
            <p>${this.errorMessage}</p>
          </div>
        `}
    `;
  }

  static styles = css`
    .auth-container {
      font-family: var(--md-ref-typeface-plain);
    }
    h2 {
      font-family: var(--title-font);
    }
    p {
      font-family: var(--md-ref-typeface-plain);
    }
  `;
}
