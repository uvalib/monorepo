import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

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

    .modal .close-button {
      position: fixed;
    }
  `;

  render() {
    return html`
      <slot name="opener"></slot>

      <dialog id="dialog" part="dialog" class="${this.modal ? 'modal' : ''}">
        ${this.xClose ? html`<site-fab class="close-button" icon="close" @click="${this.close}"></site-fab>` : ''}
        <div class="content">
          <slot></slot>
        </div>
      </dialog>
    `;
  }

  async firstUpdated() {
    if (this.xClose) {
      // Dynamically import the 'site-fab' module if xClose is true
      await import('@uvalib/site-button/site-fab.js' as any);
    }
    
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
