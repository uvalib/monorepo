// web-src/ts/chat-input.ts
import { LitElement, html, css, property } from 'lit';
import '@material/web/button/filled-button.js';
import '@material/web/textfield/filled-text-field.js';

export class ChatInput extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      padding: 8px;
      border-top: 1px solid var(--md-sys-color-outline);
    }
    md-filled-text-field {
      flex-grow: 1;
      margin-right: 8px;
    }
  `;

  render() {
    return html`
      <md-filled-text-field id="message-input" label="Type your message" @keydown="${this.handleKeyDown}"></md-filled-text-field>
      <md-filled-button @click="${this.sendMessage}">Send</md-filled-button>
    `;
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private sendMessage() {
    const input = this.shadowRoot?.getElementById('message-input') as HTMLInputElement;
    if (input) {
      const event = new CustomEvent('send-message', {
        detail: { text: input.value },
      });
      this.dispatchEvent(event);
      input.value = '';
    }
  }
}