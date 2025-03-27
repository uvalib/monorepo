import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

interface AssistantSearchConfig {
  searchId: string;
  suggestId: string;
  submit: string;
}

interface AssistantConfig {
  searchAssist?: AssistantSearchConfig;
  // Optionally, you can pass the WebSocket endpoint via config.
  wsEndpoint?: string;
}

export class UvalibAssistant extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--uvalib-assistant-text-color, #000);
    }
    .suggestions {
      margin-top: 10px;
      background: #f2f2f2;
      padding: 8px;
      border-radius: 4px;
    }
    .suggestions ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .suggestions li {
      padding: 4px 0;
      cursor: pointer;
    }
    .suggestions li:hover {
      background: #e0e0e0;
    }
  `;

  @property({ type: Object })
  config: AssistantConfig = {};

  @property({ type: Array })
  suggestions: string[] = [];

  private socket: WebSocket | null = null;

  // Use the light DOM so we can easily access host-page elements.
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this._parseConfig();
    this._initWebSocket();
    this._attachFormListener();
    this._checkPreFilled();
  }

  // Parse the configuration JSON from a <script type="assistant-config"> block.
  private _parseConfig() {
    const configScript = this.querySelector('script[type="assistant-config"]');
    if (configScript) {
      try {
        this.config = JSON.parse(configScript.textContent || '{}');
      } catch (e) {
        console.error('Error parsing assistant config:', e);
      }
    }
  }

  // Initialize the WebSocket connection.
  private _initWebSocket() {
    // Use the wsEndpoint from config if provided; otherwise, use a hard-coded default.
    const wsEndpoint = this.config.wsEndpoint || "wss://x8qxufgdfl.execute-api.us-east-1.amazonaws.com/production/";
    this.socket = new WebSocket(wsEndpoint);

    this.socket.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    this.socket.onmessage = (event: MessageEvent) => {
      console.log("Received message:", event.data);
      try {
        const data = JSON.parse(event.data);
        if (data.suggestions) {
          this.suggestions = data.suggestions;
          // Update the suggestion element.
          const suggestionDiv = document.getElementById(this.config.searchAssist?.suggestId || '');
          if (suggestionDiv) {
            suggestionDiv.innerHTML = this._renderSuggestions(this.suggestions);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message", error);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };
  }

  // If the search input is already filled, send the query immediately.
  private _checkPreFilled() {
    if (!this.config?.searchAssist) return;
    const { searchId } = this.config.searchAssist;
    const searchInput = document.getElementById(searchId) as HTMLInputElement;
    if (searchInput && searchInput.value.trim() !== '') {
      this._handleSubmit();
    }
  }

  // Attach a click listener to the search button.
  // We do not call preventDefault() here so the page can handle submission as needed.
  private _attachFormListener() {
    if (!this.config?.searchAssist) return;
    const { submit } = this.config.searchAssist;
    const submitBtn = document.getElementById(submit);
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this._handleSubmit();
      });
    }
  }

  // Send the query over the WebSocket.
  private _handleSubmit() {
    if (!this.config?.searchAssist) return;
    const { searchId, suggestId } = this.config.searchAssist;
    const searchInput = document.getElementById(searchId) as HTMLInputElement;
    const suggestionDiv = document.getElementById(suggestId);
    if (!searchInput || !suggestionDiv) return;

    const query = searchInput.value.trim();
    if (!query) {
      suggestionDiv.textContent = '';
      return;
    }

    // Optionally show a loading message
    suggestionDiv.textContent = 'Loading suggestions...';

    this._sendQuery(query);
  }

  // Send the query over the WebSocket connection.
  private _sendQuery(query: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = { action: "query", data: query };
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open.");
    }
  }

  // Generate HTML for the suggestions list.
  private _renderSuggestions(suggestions: string[]): string {
    if (!suggestions || suggestions.length === 0) return '';
    return `
      <div class="suggestions">
        <ul>
          ${suggestions.map((s) => `<li>${s}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  render() {
    // The component renders a slot so any light-DOM content remains visible.
    return html`<slot></slot>`;
  }
}