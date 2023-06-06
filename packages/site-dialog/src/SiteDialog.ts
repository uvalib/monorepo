import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import '@uvalib/site-button/site-button.js';

export class SiteDialog extends LitElement {
  @property({ type: Boolean }) modal = false;
  @property({ type: Boolean, attribute: "x-close" }) xClose = false;

  static styles = css`
    :host {
      --dialog-background-color: white;
      --dialog-border-color: #ccc;
      --dialog-border-radius: 4px;
      --dialog-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      --dialog-max-width: 80vw;
      --dialog-max-height: 80vh;
    }

    dialog {
      border: none;
      border-radius: var(--dialog-border-radius);
      box-shadow: var(--dialog-box-shadow);
      background: var(--dialog-background-color);
      color: var(--dialog-text-color);
      position: relative;
    }

    .content {
      max-width: var(--dialog-max-width);
      max-height: var(--dialog-max-height);
      overflow: auto;
    }

    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 1.5em;
      background: none;
      border: none;
    }

    .close-button::part(button) {
      margin: 0;
      padding: 0;
    }
  `;

  render() {
    return html`
      <slot name="opener"></slot>

      <dialog id="dialog" part="dialog">
        ${this.xClose ? html`<site-button class="close-button" @click="${this.close}">&times;</site-button>` : ''}
        <div class="content">
          <slot></slot>
        </div>
      </dialog>
    `;
  }

  firstUpdated() {
    if (this.modal) {
      const dialog = this.shadowRoot?.getElementById('dialog') as HTMLDialogElement;
      dialog.setAttribute('modal', '');
    }

    const openerSlot = this.shadowRoot?.querySelector('slot[name="opener"]') as HTMLSlotElement;
    openerSlot?.assignedNodes().forEach((node: Node) => {
      if ((node as HTMLElement).tagName === 'BUTTON' || (node as HTMLElement).tagName === 'SITE-BUTTON') {
        (node as HTMLElement).addEventListener('click', () => this.open());
      }
    });
  }

  open() {
    const dialog = this.shadowRoot?.getElementById('dialog') as any;
    if (this.modal) {
      dialog.showModal();
    } else {
      dialog.show();
    }
  }
  
  close() {
    const dialog = this.shadowRoot?.getElementById('dialog') as any;
    dialog.close();
  }  
}
