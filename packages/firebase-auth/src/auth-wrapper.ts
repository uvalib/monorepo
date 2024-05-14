import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import './firebase-auth.js';

@customElement('auth-wrapper')
class AuthWrapper extends LitElement {

    @property( { type: Object, attribute:"firebase-config" } ) firebaseConfig?: any;

    @property({ type: Object }) user = null;
    @property({ type: Boolean }) loggedIn = false;

    render() {
        return html`
            <firebase-auth
                .config=${this.firebaseConfig}
                @auth-changed="${(e: CustomEvent) => {
                    this.user = e.detail.user;
                    this.loggedIn = !!this.user;
                }}"></firebase-auth>
            ${ this.loggedIn ? html`
                <slot></slot>
            ` : html`
                <p>Please log in to use the editor</p>
            `}
        `;
    }

}