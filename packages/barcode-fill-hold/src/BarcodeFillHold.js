import { LitElement, html, css } from 'lit-element';
import '@uvalib/uvalib-page/uvalib-page.js';
import '@spectrum-web-components/bundle/elements.js';
import { Overlay } from '@spectrum-web-components/overlay';
import { Sirsi } from '@uvalib/data-models/lib/sirsi.js';
import { formatRelative, formatISO9075 } from 'date-fns';

export class BarcodeFillHold extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      working: { type: Boolean },
      authenticated: { type: Boolean },
      _userID: { type: String },
      _userPass: { type: String },
      dummyMode: { type: Boolean },
      autoPrint: { type: Boolean },
      holdRequests: { type: Array },
      _dialogHeading: { type: String },
      _dialogBody: { type: String }
    };
  }

  set authenticated(val) {
    let oldVal = this._authenticated;
    this._authenticated = val;
    this.requestUpdate('authenticated', oldVal);
    let barcodeform = this.shadowRoot.getElementById('barcodeform');
    if (val && barcodeform) {
      this.shadowRoot.getElementById('barcodeform').removeAttribute('hidden');
      this.shadowRoot.getElementById('barcode').focus();
    } else if (barcodeform) {
      this.shadowRoot.getElementById('barcodeform').setAttribute('hidden', '');
    }
  }
  get authenticated() {
    return this._authenticated;
  }

  // Define our own setter/getter for this one to update sirsi
  set dummyMode(val) {
    let oldVal = this._dummyMode;
    this._dummyMode = val;
    this.authenticated = false;
    this.requestUpdate('dummyMode', oldVal);
    if (this.sirsi) this.sirsi.dummyMode = val;
  }
  get dummyMode() {
    return this._dummyMode;
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        max-width: 960px;
        margin: 0 auto;
      }

      .hold {
        margin-top: 15px;
      }
      .hold .title {
        
      }

      #printView {
        display: none;
      }
      sp-button-group {
        padding-top: 15px;
      }
      sp-popover {
        z-index: 10;
        position: absolute;
      }
      [hidden] {
        display: none !important;
      }

      @media print {
        :host {
          min-height: inherit !important;
          align-items: left !important;
          text-align: left !important;
        }
        :host main {
          display: none !important;
        }
        :host #printView {
          display: block !important;
        }
        :host sp-underlay {
          display: none !important;
        }
        dl {
          page-break-after: always;
        }
      }
    `;
  }

  constructor() {
    super();
    this.title = 'LEO Checkout Module';
    this.working = false;
    this._userID = '';
    this._userPass = '';
    this.dummyMode = false;
    this.autoPrint = true;
    this.sirsi = new Sirsi({ dummyMode: this.dummyMode });
    this.holdRequests = [];

    window.addEventListener('beforeprint', this._beforePrint.bind(this));
    window.addEventListener('afterprint', this._afterPrint.bind(this));
  }

  render() {
    return html`
      <div id="printView">
        <h1>Print only</h1>
      </div>
      <main>
        <sp-theme scale="large" color="${this.dummyMode ? 'dark' : 'light'}">
          <sp-popover placement="top-start" dialog>
            <sp-dialog size="medium" dismissable @close="${this._closeDialog}">
              <h2 id="dialogHeading" slot="heading">${this._dialogHeading}</h2>
              <div id="dialogBody">${this._dialogBody}</div>
            </sp-dialog>
          </sp-popover>
          <div class="logo"></div>
          <h1>${this.title}</h1>

          <sp-button
          variant="secondary"
          @click="${e=>{
            const trigger = e.target;
            const interaction = 'modal';
            const content = e.target.nextElementSibling;
            const options = {
                offset: 0,
                placement: 'none',
                receivesFocus: 'auto',
            };
            Overlay.open(
                trigger, 
                interaction,
                content,
                options
            );
            e.target.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
              detail: {event:["Options","opened"]}, bubbles: true, composed: true
            }));
          }}
          ">Options</sp-button>
      <sp-tray>
        <sp-dialog size="small" dismissable>
          <h2 slot="heading">Options</h2>
          <sp-field-group vertical>          
            <sp-switch label="Auto Print ${this.autoPrint ? 'On' : 'Off'}"
              @change="${(e) => { 
                this.autoPrint = !this.autoPrint; 
                e.target.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
                  detail: {event:["Options","autoPrint",this.autoPrint ? 'On' : 'Off']}, bubbles: true, composed: true
                }));
              }}"
              value="${this.autoPrint ? 'on' : 'off'}"
              ?checked="${this.autoPrint}">Auto Print ${this.autoPrint ? 'On' : 'Off'}</sp-switch>
            <sp-switch label="Dummy Mode ${this.dummyMode ? 'On' : 'Off'}"
              @change="${(e) => { 
                this.dummyMode = !this.dummyMode; 
                e.target.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
                  detail: {event:["Options","dummyMode",this.dummyMode ? 'On' : 'Off']}, bubbles: true, composed: true
                }));
              }}"
              value="${this.dummyMode ? 'on' : 'off'}"
              ?checked="${this.dummyMode}">Dummy Mode ${this.dummyMode ? 'On' : 'Off'}</sp-switch>
          </sp-field-group>
        </sp-dialog>
      </sp-tray>

          <div id="login" ?hidden="${this.authenticated}">
            <sp-field-label for="userid">Sirsi Staff UserID</sp-field-label>
            <sp-textfield
              @keyup="${this._trackEnter}"
              @change="${e => (this._userID = e.target.value)}"
              value="${this._userID}"
              id="userid"
              placeholder="Enter your Sirsi staff ID"
            ></sp-textfield>
            <sp-field-label for="password">Sirsi Staff Password</sp-field-label>
            <sp-textfield
              @keyup="${this._trackEnter}"
              @change="${e => (this._userPass = e.target.value)}"
              value="${this._userPass}"
              id="password"
              type="password"
              placeholder="Enter your Sirsi staff Password"
            ></sp-textfield>
            <sp-button-group>
              <sp-button @click="${this._handleLogin}">Login</sp-button>
              <sp-button variant="secondary" @click="${this._handleClear}" quiet
                >Clear</sp-button
              >
            </sp-button-group>
          </div>
          <div id="barcodeform" ?hidden="${!this.authenticated}">
            <sp-field-label for="barcode"
              >Enter Barcode for Hold ${this.dummyMode ? "(Try 'error' or 'override')" : ''}</sp-field-label
            >
            <sp-textfield
              @keyup="${this._trackBarcodeEnter}"
              @change="${e => (
                this.lastBarcode = e.target.value
              )}"
              id="barcode"
              placeholder="Enter Barcode for Hold"
            ></sp-textfield>

            <sp-button @click="${this._printAll}" ?hidden="${!this._isItemsToPrint()}">Print All</sp-button>

            <div id="listing">
              ${this.holdRequests.map((item,index)=>html`
                <div class="hold">
                  <div class="title">#${index+1}: ${item.hold.title}</div>
                  <div>
                    <sp-button-group index="${index}">
                        ${!item.printed
                          ? html`
                              <sp-button
                                @click="${e => {
                                  this._printByIndex(
                                    e.target.parentNode.getAttribute('index')
                                  );
                                }}"
                                >Print</sp-button
                              >
                            `
                          : html`
                              <sp-button
                                @click="${e => {
                                  this._printByIndex(
                                    e.target.parentNode.getAttribute('index')
                                  );
                                }}"
                                >Print Again</sp-button
                              >
                              <sp-button
                                @click="${e => {
                                  this._clearByIndex(
                                    e.target.parentNode.getAttribute('index')
                                  );
                                }}"
                                variant="secondary"
                                >Clear</sp-button
                              >
                            `}
                    </sp-button-group>
                  </div>
                </div>
                <hr />
              `)}
              ${(this.holdRequests)? html`
              <sp-button variant="secondary"
              @click="${e => {
                this._clearPrinted();
              }}"
              >Clear All Printed</sp-button>
              `:''}
            </div>


          </div>
          <sp-underlay ?open="${this.working}"></sp-underlay>
        </sp-theme>
      </main>
    `;
  }

  _trackEnter(e) {
    if (e.keyCode === 13) {
      if (this._userID && this._userPass) this._handleLogin();
    }
  }
  _trackBarcodeEnter(e) {
    if (e.keyCode === 13 && this.authenticated) {
      this._processBarcode();
    }
  }
  _processBarcode(override = false) {
    console.log(`we have a barcode '${this.lastBarcode}'!`);
    this.latestSubmissionDate = new Date();
    this.working = true;

    this.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
      detail: {event:["hold-fill","request",this.lastBarcode]}, bubbles: true, composed: true
    }));

    // submit the barcode and process the result
    this.sirsi.fillhold(this.lastBarcode, override).then(res => {
      console.log(`we got a result`);
      console.log(res);
      if (res.hold.error_messages.length > 0) {
        if (
          res.hold.error_messages.find(
            m => m.code && m.code == 'itemHasMultiplePieces'
          )
        ) {
          this._dialogHeading = 'Override?';
          this._dialogBody = html`
            ${res.hold.error_messages.map(m => m.message).join('<br />')}
            <sp-button-group>
              <sp-button
                @click="${function () {
                  this._closeDialog();
                  this._processBarcode(true);
                }.bind(this)}"
                >Continue</sp-button
              >
              <sp-button @click="${this._closeDialog}" variant="secondary"
                >Cancel</sp-button
              >
            </sp-button-group>
          `;

          this.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
            detail: {event:["hold-fill","error",this.lastBarcode,res.hold.error_messages.map(m => m.message).join('--')]}, bubbles: true, composed: true
          }));
        } else {
          this._dialogHeading = 'Error';
          this._dialogBody = res.hold.error_messages.map(m=>m.message?m.message:m).join('<br />');
          
          this.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
            detail: {event:["hold-fill","error",this.lastBarcode,res.hold.error_messages.map(m=>m.message?m.message:m).join('<br />')]}, bubbles: true, composed: true
          }));
        }
        this.shadowRoot.querySelector('sp-popover').setAttribute('open', '');
      } else {
        this.shadowRoot.getElementById('barcode').value = '';
        this.lastBarcodeResult = res;
        if (this.autoPrint) {
          this.shadowRoot.getElementById('printView').innerHTML = this._formatPrint(res);
          res.printed = true;
          this.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
            detail: {event:["hold-fill","auto-print",this.lastBarcode]}, bubbles: true, composed: true
          }));          
          window.print();
          this.working = false;
        } else {
          this.working = false;
        }
        this.holdRequests.push(res);
      }
    });
  }
  _handleLogin() {
    if (this._userID && this._userPass) {
      this.working = true;
      this.sirsi.authorize(this._userID, this._userPass).then(token => {
        if (token) {
          this.authenticated = true;
          console.info('we are authenticated');
          this.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
            detail: {event:["Login","authenticated",this._userID]}, bubbles: true, composed: true
          }));
        } else {
          this.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
            detail: {event:["Login","not-authenticated",this._userID]}, bubbles: true, composed: true
          }));
        }
        this.working = false;
      });
    }
  }
  _handleClear() {
    this._userPass = '';
    this._userID = '';
  }
  _beforePrint() {
    console.log('getting ready to print');
  }
  _afterPrint() {
    console.log('print dialog closed');
    this.working = false;
  }
  _clearByIndex(index) {
    this.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
      detail: {event:["hold-fill","queue-remove",this.holdRequests[index].hold.item_id]}, bubbles: true, composed: true
    }));
    this.holdRequests.splice(index, 1);
    this.holdRequests = this.holdRequests.slice(); // get a shallow copy to notify
  }
  _printByIndex(index) {
    if (this.holdRequests[index]) {
      this.shadowRoot.getElementById('printView').innerHTML = this._formatPrint(this.holdRequests[index]);
      this.holdRequests[index].printed = true;
      window.print();
      this.holdRequests = this.holdRequests.slice(); // get a shallow copy to notify
      this.working = false;
      this.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
        detail: {event:["hold-fill","print",this.holdRequests[index].hold.item_id]}, bubbles: true, composed: true
      }));
    }
  }
  _clearPrinted() {
    this.holdRequests = this.holdRequests.filter(r=>!r.printed);
    this.holdRequests = this.holdRequests.slice(); // get a shallow copy to notify
    this.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
      detail: {event:["hold-fill","clear-printed"]}, bubbles: true, composed: true
    }));
  }
  _isItemsToPrint() {
    return this.holdRequests.find(i=>i.hold && !i.printed);
  }
  _printAll() {
    this.shadowRoot.getElementById('printView').innerHTML = '';
    this.holdRequests.filter(r=>!r.printed).forEach(i=>{
      this.shadowRoot.getElementById('printView').innerHTML += this._formatPrint(i);
      i.printed = true;
    });
    window.print();
    this.holdRequests = this.holdRequests.slice(); // get a shallow copy to notify
    this.working - false;
    this.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
      detail: {event:["hold-fill","print-all"]}, bubbles: true, composed: true
    }));
  }
  _formatPrint(res) {
    return `
    <dl>
    ${
      res.user.Department
        ? `<dt>Department</dt><dd><strong style="font-size: 1.5em">${res.user.Department}</strong></dd>`
        : ''
    }
    ${res.user.Country ? `<dt>Country</dt><dd>${res.user.Country}</dd>` : ''}
    ${
      res.user.Organization
        ? `<dt>Organization</dt><dd>${res.user.Organization}</dd>`
        : ''
    }
    ${res.user.Status ? `<dt>Status</dt><dd><strong>${res.user.Status}</strong></dd>` : ''}
    ${res.user.Fax ? `<dt>Fax</dt><dd><strong>${res.user.Fax}</strong></dd>` : ''}
    ${
      res.hold.user_full_name
        ? `<dt>Patron</dt><dd>${res.hold.user_full_name} (${res.hold.user_id})</dd>`
        : ''
    }
    ${res.hold.item_id ? `<dt>Item ID</dt><dd>${res.hold.item_id}</dd>` : ''}
    ${
      res.timestamp
        ? `<dt>Timestamp</dt><dd>${formatISO9075(res.timestamp)}</dd>`
        : ''
    }
    ${
      res.hold.pickup_location
        ? `<dt>Pickup Location</dt><dd>${res.hold.pickup_location}</dd>`
        : ''
    }
    </dl>  
    `;
  }
  _closeDialog() {
    this.shadowRoot.querySelector('sp-popover').removeAttribute('open');
    this.working = false;
  }
  _resetForm() {
    let input = this.shadowRoot.getElementById('barcode');
    input.value = '';
    input.focus();
  }
}
