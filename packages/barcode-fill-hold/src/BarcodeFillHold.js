import { LitElement, html, css } from 'lit-element';
import '@uvalib/uvalib-page/uvalib-page.js';
import '@spectrum-web-components/bundle/elements.js';
import {Sirsi} from "@uvalib/data-models/lib/sirsi.js";

export class BarcodeFillHold extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      working: { type: Boolean },
      authenticated: { type: Boolean },
      _userID: { type: String },
      _userPass: { type: String },
      dummyMode: { type:Boolean },
      holdRequests: { type:Array }
    };
  }

  set authenticated(val){
    let oldVal = this._authenticated;
    this._authenticated = val;
    this.requestUpdate('authenticated', oldVal);
    if(val) {
      this.shadowRoot.getElementById('barcodeform').removeAttribute('hidden');
      this.shadowRoot.getElementById('barcode').focus();
    } else {
      this.shadowRoot.getElementById('barcodeform').setAttribute('hidden','');
    }
  }
  get authenticated(){
    return this._authenticated;
  }

  // Define our own setter/getter for this one to update sirsi
  set dummyMode(val){
    let oldVal = this._dummyMode;
    this._dummyMode = val;
    this.requestUpdate('dummyMode', oldVal);
    if (this.sirsi) this.sirsi.dummyMode = val;
  }
  get dummyMode(){
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
/*        text-align: center; */
      }
      #printView {
        display:none;
      }
      sp-button-group {
        padding-top: 15px;
      }
      sp-accordion {
        padding-top: 25px;
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
      }
    `;
  }

  constructor() {
    super();
    this.title = 'Tedium Reducer III';
    this.working = false;
    this._userID = '';
    this._userPass = '';
    this.dummyMode = false;
    this.sirsi = new Sirsi({dummyMode:this.dummyMode});
    this.holdRequests = [];

    window.addEventListener('beforeprint', this._beforePrint.bind(this) );
    window.addEventListener('afterprint', this._afterPrint.bind(this) );
  }

  render() {
    return html`
      <div id="printView">
        <h1>Print only</h1>
      </div>
      <main>
        <sp-theme scale="large" color="${this.dummyMode? "dark":"light"}">
        <sp-popover placement="top-start" dialog>
            <sp-dialog size="medium" dismissable @close="${this._closeDialog}">
                <h2 slot="heading">Disclaimer</h2>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Auctor augue mauris
                augue neque gravida. Libero volutpat sed ornare arcu. Quisque egestas diam
                in arcu cursus euismod quis viverra. Posuere ac ut consequat semper viverra
                nam libero justo laoreet. Enim ut tellus elementum sagittis vitae et leo
                duis ut. Neque laoreet suspendisse interdum consectetur libero id faucibus
                nisl. Diam volutpat commodo sed egestas egestas. Dolor magna eget est lorem
                ipsum dolor. Vitae suscipit tellus mauris a diam maecenas sed. Turpis in eu
                mi bibendum neque egestas congue. Rhoncus est pellentesque elit ullamcorper
                dignissim cras lobortis.
            </sp-dialog>
          </sp-popover>
          <div class="logo"></div>
          <h1>${this.title}</h1>
          <div><sp-switch label="Dummy Mode ${this.dummyMode? "On":"Off"}" @change="${()=>{this.dummyMode=!this.dummyMode}}" value="${this.dummyMode?"on":"off"}" ?checked="${this.dummyMode}">Dummy Mode ${this.dummyMode? "On":"Off"}</sp-switch></div>

          <div id="login" ?hidden="${this.authenticated}">
            <sp-field-label for="userid">Sirsi Staff UserID</sp-field-label>
            <sp-textfield @keyup="${this._trackEnter}" @change="${ (e)=>this._userID=e.target.value }" value="${this._userID}" id="userid" placeholder="Enter your Sirsi staff ID"></sp-textfield>
            <sp-field-label for="password">Sirsi Staff Password</sp-field-label>
            <sp-textfield @keyup="${this._trackEnter}" @change="${ (e)=>this._userPass=e.target.value }" value="${this._userPass}" id="password" type="password" placeholder="Enter your Sirsi staff Password"></sp-textfield>
            <sp-button-group>
              <sp-button @click="${this._handleLogin}">Login</sp-button>
              <sp-button variant="secondary" @click="${this._handleClear}" quiet>Clear</sp-button>
            </sp-button-group>
          </div>
          <div id="barcodeform" ?hidden="${!this.authenticated}">
            <sp-field-label for="barcode">Enter Barcode for Hold</sp-field-label>
            <sp-textfield @keyup="${this._trackBarcodeEnter}" @change="${(e)=>this.lastBarcode=e.target.value}" id="barcode" placeholder="Enter Barcode for Hold"></sp-textfield>

            <sp-accordion>
              ${this.holdRequests.map(res => html`
                <sp-accordion-item label="${res.hold.title}">
                    <div>buttons to do something</div>
                </sp-accordion-item>
              `)}
            </sp-accordion>
          </div>
          <sp-underlay ?open="${this.working}"></sp-underlay>
          
        </sp-theme>
      </main>
    `;
  }

  _trackEnter(e){ 
    if (e.keyCode === 13) {
      if (this._userID && this._userPass) this._handleLogin();
    }
  }
  _trackBarcodeEnter(e){ 
    if (e.keyCode === 13 && this.authenticated) {
      console.log(`we have a barcode '${this.lastBarcode}'!`);
      this.working = true;
      // submit the barcode and process the result
      this.sirsi.fillhold(this.lastBarcode)
        .then(res=>{
          console.log(`we got a result`);
          console.log(res);
          if (res.hold.error_messages.length > 0) {
            // Process the errors
            this.shadowRoot.querySelector('sp-popover').setAttribute('open','');
          } else {
            this.shadowRoot.getElementById('barcode').value = "";
            this.lastBarcodeResult = res;
            this._formatPrint(res);
            this.holdRequests.push(res);
            window.print();
          }
        });
    }
  }
  _handleLogin(){
    if ( this._userID && this._userPass ) {
      this.working = true;
      this.sirsi.authorize(this._userID, this._userPass)
        .then(token=>{
          if (token) {
            this.authenticated = true;
            console.info("we are authenticated");
          }
          this.working = false;
        });
    }
  }
  _handleClear(){
    this._userPass = '';
    this._userID = '';
  }
  _beforePrint(){
    console.log('getting ready to print');
    this.working = true;
  }
  _afterPrint(){
    console.log('print dialog closed');
    this.working = false;
  }
  _formatPrint(res) {
    this.shadowRoot.getElementById('printView').innerHTML = `
    <dl>
${res.hold.title? `<dt>Title</dt><dd>${res.hold.title}</dd>`:''}
${res.hold.author? `<dt>Author</dt><dd>${res.hold.author}</dd>`:''}
${res.hold.item_id? `<dt>Item ID</dt><dd>${res.hold.item_id}</dd>`:''}
${res.hold.pickup_location? `<dt>Pickup Location</dt><dd>${res.hold.pickup_location}</dd>`:''}
${res.hold.pickup_location? `<dt>Pickup Location</dt><dd>${res.hold.pickup_location}</dd>`:''}
${res.hold.user_full_name? `<dt>Patron</dt><dd>${res.hold.user_full_name} (${res.hold.user_id})</dd>`:''}

    </dl>  
    `;
  }
  _closeDialog() {
    this.shadowRoot.querySelector('sp-popover').removeAttribute('open');
    this.working = false;
  }

}
