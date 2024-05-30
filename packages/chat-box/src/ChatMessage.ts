// web-src/ts/chat-message.ts
import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';

interface Message {
  sender: string;
  senderName: string;
  text: string;
}

export class ChatMessage extends LitElement {
  @property({ type: Object })
message: Message = { sender: '', senderName: '', text: '' };

@state()
private renderedHtml: string = '';

  static styles = css`
    :host {
      display: block;
      margin-bottom: 8px;
    }
    .message {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 8px;
      border-radius: 8px;
      max-width: 75%;
    }
    .user {
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      align-self: flex-end;
      margin-left: auto;
    }
    .bot {
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      align-self: flex-start;
      margin-right: auto;
    }
    .sender {
      font-weight: bold;
      margin-bottom: 4px;
    }
  `;

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('message')) {
      this.renderMessageHtml();
    }
  }

  async renderMessageHtml() {
    if (this.message && this.message.text) {
      this.renderedHtml = await marked(this.message.text);
    }
  }

  render() {
    return html`
      <div class="message ${this.message.sender}">
        <div class="sender">${this.message.senderName}</div>
        <span>${unsafeHTML(this.renderedHtml)}</span>
      </div>
    `;
  }
}