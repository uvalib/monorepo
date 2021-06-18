import { LitElement, html, css } from 'lit-element';
import 'playground-elements/playground-ide.js';

export class UvalibKitchenSink extends LitElement {
  static get properties() {
    return {
      title: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        background-color: var(--uvalib-kitchen-sink-background-color);
      }

      main {
        flex-grow: 1;
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }
    `;
  }

  constructor() {
    super();
    this.title = 'My app';
  }

  render() {
    return html`
      <main>
        <h1>${this.title}</h1>

<h2><a href="https://github.com/uvalib/monorepo/tree/master/packages/eslint-config">eslint-config</a></h2>
<p>Todo: Placeholder for a cross package eslint config.</p>

<h2>&lt;uvalib-logos&gt;</h2>        
      <playground-ide editable-file-system line-numbers resizable>

        <script type="sample/html" filename="index.html">
          <!doctype html>
          <body style="background-color: black;">
            <script type="module" src="./index.js">&lt;/script>
            <uvalib-logos>University of Virginia Library</uvalib-logos>
          </body>
        </script>
      
        <script type="sample/js" filename="index.js">
          import '@uvalib/uvalib-logos/uvalib-logos.js';
        </script>
      </playground-ide>
      
      </main>

      <p class="app-footer">
        🚽 Made with love by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/open-wc"
          >open-wc</a
        >.
      </p>
    `;
  }
}
