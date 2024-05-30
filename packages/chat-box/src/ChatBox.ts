// web-src/ts/chat-box.ts
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove, Database } from 'firebase/database';
import { getAuth, onAuthStateChanged, Auth, User } from 'firebase/auth';
import '@material/web/button/filled-button.js';
import './chat-message.js';
import './chat-input.js';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface Message {
  sender: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export class ChatBox extends LitElement {
  @property({ type: Array })
  messages: Message[] = [];

  @property({ type: String })
  userId: string | null = null;

  @property({ type: String })
  path: string = 'chats'; // Default path if not provided

  @property({ type: Object })
  firebaseConfig: FirebaseConfig | null = null;

  private app: FirebaseApp | null = null;
  private database: Database | null = null;
  private auth: Auth | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.firebaseConfig) {
      this.initializeFirebase(this.firebaseConfig);
    }
  }

  private initializeFirebase(config: FirebaseConfig) {
    this.app = initializeApp(config);
    this.database = getDatabase(this.app);
    this.auth = getAuth(this.app);
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
        this.listenForMessages();
      } else {
        this.userId = null;
      }
    });
  }

  private listenForMessages() {
    if (this.userId && this.database) {
      const messagesRef = ref(this.database, `${this.path}/${this.userId}`);
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        this.messages = data ? Object.values(data) : [];
        this.scrollToBottom();
      });
    }
  }

  private handleSendMessage(event: CustomEvent) {
    const newMessage: Message = {
      sender: 'user',
      senderName: 'You', // Adjust as needed to reflect the user's actual name
      text: event.detail.text,
      timestamp: new Date().toISOString(),
    };
    this.saveMessage(newMessage);
  }

  private saveMessage(message: Message) {
    if (this.userId && this.database) {
      const messagesRef = ref(this.database, `${this.path}/${this.userId}`);
      push(messagesRef, message);
    }
  }

  private resetConversation() {
    if (this.userId && this.database) {
      const messagesRef = ref(this.database, `${this.path}/${this.userId}`);
      remove(messagesRef).then(() => {
        this.messages = [];
      });
    }
  }

  private scrollToBottom() {
    const messagesContainer = this.shadowRoot?.querySelector('.messages');
    if (messagesContainer) {
      (messagesContainer as HTMLElement).scrollTop = messagesContainer.scrollHeight;
    }
  }

  render() {
    return html`
      <div class="chat-box">
        <div class="messages">
          ${this.messages.map(
            (message) => html`<chat-message .message="${message}"></chat-message>`
          )}
        </div>
        <chat-input @send-message="${this.handleSendMessage}"></chat-input>
        <md-filled-button @click="${this.resetConversation}">Reset</md-filled-button>
      </div>
    `;
  }

  static styles = css`
    .chat-box {
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: 500px;
      padding: 16px;
      border: 1px solid var(--md-sys-color-outline);
      border-radius: 8px;
      background-color: var(--md-sys-color-surface);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .messages {
      flex-grow: 1;
      overflow-y: auto;
      padding-bottom: 8px;
      display: flex;
      flex-direction: column;
    }
    md-filled-button {
      margin-top: 8px;
    }
  `;
}
