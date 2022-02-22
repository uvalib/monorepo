import { html, css, LitElement } from 'lit';
import "@uvalib/uvalib-account/uvalib-account-user.js";
import "@uvalib/uvalib-data/uvalib-data.js";
import "./UvalibField.js";

export class UvalibFormBuilder extends LitElement {
  static get styles() {
    return css`
      [hidden] { display: none; }
    `;
  }

  static get properties() {
    return {
      /**
       * Used to indicate which workflow the server should use when processing the request submitted.
       */
      formId: {
        attribute: "form-id",
        type: String
      },
      /**
       * An array containing the form page returned for the specified form id.
       */
      formPage: {
        attribute: "form-page",
        type: Object
      },
      /**
       * Authenticated form indicator.
       */
      _authenticated: {
        type: Boolean,
      },
      /**
       * The form elements.
       */
      _elements: {
        type: Array
      },
      _visible: {
        type: Boolean
      },
      /**
       * User name, email address, department, etc. for use in pre-populating some information.
       */
      userInfo: {
        attribute: "user-info",
        type: Object
      },
      /**
       * list of field ids containing errors, each with an appropriate message.
       */
      _errors: {
        type: Array
      },
      /**
       * Indicator there are fields with missing or invalid data.
       */
      _invalidValues: {
        type: Boolean
      },
      /**
       * Appropriate aria-live attribute value in the event of a form submission error.
       */
      _alertLevel: {
        type: String
      },
      _firebaseProblem: {
        type: Boolean
      },
    };
  }

  constructor() {
    super();
    // defaults
    this._elements = [];
    this._authenticated = false;
    this._visible = false;
    this.userInfo = {
      computing_id: '',
      name: '',
      email: '',
      phone: '',
      affiliation: '',
      department_school: '',
      processed_dept_school: ''
    };
    this._errors = [];
    this._firebaseProblem = false;

    this.addEventListener('changedValue', function(e){
      const idx = this._elements.findIndex(el=>{return el.name===e.detail.field_id});
      if ( idx>=0 ) {
        let copyelements = this._elements.slice();
        copyelements[idx].value = e.detail.value;
        this._elements = copyelements;
      }
    }.bind(this));
    
  }

  connectedCallback(){
    super.connectedCallback();

    // Setup a data model for the form definition
    this.db = document.createElement('uvalib-data');
    this.db.id = "db";
    this.shadowRoot.appendChild(this.db);
  }

  updated(changedProps) {
    super.updated(changedProps);
    if ( changedProps.has('formId') ) { this._getFormDef(); }
    if ( changedProps.has('formPage') ) { 
      this._parseFormPage();
      this._dispatchEvent('formPageDefUpdated', {formPage: this.formPage}) 
    }
    if ( changedProps.has('_elements') ) {
      this._isFormAuthenticated()
      this._dispatchEvent('formElementsUpdated', {formElements: this._elements})
    }
    if ( changedProps.has('_authenticated') ) {
      this._readyToDisplayForm();
    }
    if ( changedProps.has('userInfo') ) {
      console.log( this.userInfo );
      this._readyToDisplayForm();
    }
    if ( changedProps.has('_errors') ) {
      this._invalidValues = this._errors.length > 0;
      /* If errors exist then the aria-live attribute for the error content should be set to assertive. */
      this._ariaLiveAlert = (this._errors.length > 0)? 'assertive':'';
    }
  }

  _readyToDisplayForm() {
    // If the form is NetBadge protected make sure the user has
    // authenticated before displaying the form
    if (this._authenticated) {
      if (this.userInfo && this.userInfo.computing_id != '') {
        this._visible = true;
      } else {
        this._visible = false;
      }
    } else {
      this._visible = true;
    }
  }

  _getFormDef(){
    if ( this.db && this.formId ) {
      this._gotFormOnce = true;
      this.db.getByChildKey('forms', 'target_id', 'purchase_requests').then(form => this.formPage = form );
    }
  }

  _isHidden(el) {
    return (el.type && el.type == "hidden");
  }

  _isMarkup(el) {
    return (el.type && el.type == "webform_markup");
  }

  _isSection(el) {
    return (el.type && el.type == "webform_section");
  }

  _isButton(el) {
    return (el.type && el.type == "webform_actions");
  }

  _isField(el) {
    return (el.type && (el.type == "hidden" || el.type == "datelist" || el.type == "datetime"
            || el.type == "file" || el.type == "number" || el.type == "email" || el.type == "tel"
            || el.type == "text" || el.type == "select" || el.type == "textarea" || el.type == "radios"
            || el.type == "container" || el.type == "checkbox" || el.type == "checkboxes"
            || el.type == "webform_actions" || el.type == "captcha"
            || el.type == 'webform_custom_composite'));
  }

  _isSelect(el) {
    return (el.type && el.type == "select");
  }

  _isRadios(el) {
    return (el.type && el.type == "radios");
  }

  _isInput(el) {
    return (el.type && (el.type == "email" || el.type == "tel" || el.type == "text" || el.type == "number"));
  }



  _testField(state) {
    var test = true;
    // very error prone test - assuming much
    for (var key in state) {
        var id = key.replace(/.*"(.*)".*/, "$1"),
            val = state[key].value;
        // need to handle checkbox group state/values
        var chkBoxGrp = id.split(/\[|\]/);
        if (chkBoxGrp.length == 3) {
          if (!this.shadowRoot.querySelector('#' + chkBoxGrp[0]) || !(chkBoxGrp[1] in this.shadowRoot.querySelector('#' + chkBoxGrp[0]).value)) {
            test = false;
            break;
          }
        } else
        // this works for simple input types where the value doesn't have multiple options
        if (!this.shadowRoot.querySelector('#' + id) || this.shadowRoot.querySelector('#' + id).value != val) {
            test = false;
            break;
        }

    }
    return test;
  }

  // Loop through the section object key values and just examine the ones with
  // fld, mkup, fldset, ???
  _getSectionFields(el) {
    let fields = Array();
    for (var key in el) {
      if (key.match(/^fld\_|fldset\_|mkup\_|actions/)) {
        fields.push(el[key]);
        if (el[key].type && el[key].type == 'textfield') {
          el[key].type = 'text';
        }
        else if (el[key].type && el[key].type == 'managed_file') {
          el[key].type = 'file';
        }
      }
    }
    return fields;
  }

  /**
   * Handle click event for getting customer between an error link and the corresponding input field.
   */
  _handleAnchor(e) {
    e.preventDefault();
    let target = e.currentTarget.getAttribute('href');
    this.shadowRoot.querySelector(target).scrollIntoView();
    // Adjust the scroll position for the header height, and we want to show the previous element (should be a label or heading)
    window.scroll(0,window.scrollY-parseInt(this._headerHeight)-parseInt(this.shadowRoot.querySelector(target).offsetHeight)-5);
    this.shadowRoot.querySelector(target).focus();
  }

  render() {
    return html`
      ${this._authenticated? html`<uvalib-account-user @contactInfo="${ e=>this.userInfo = e.detail.contactInfo }" auto></uvalib-account-user>`:''}
      
      <form method="post" ?hidden="${ !this._visible }">
        <div class="field-label required-stmt">Fields marked with an asterisk (*) are required.</div>

        <input type="hidden" name="authenticated" value="${ this._authenticated }" />
  
        <div class="errors" ?hidden="${ !this._invalidValues }" aria-live="${ this._alertLevel }">    
          <div id="submissionProblems">A problem has occurred.
              <div class="errorCount" ?hidden="${ this._firebaseProblem }"> Please address the following <span>${ this._errors.length }</span> <span>${ (this._errors.length == 1)? 'error':'errors' }</span> and re-submit the form.</div>
          </div>

          <!--  insert error messages here after submit validation -->
          <nav id="errorList" aria-labelledby="submissionProblems" tabindex="0">
            <ul>${ this._errors.map(e => html`<li><a href="#${ e.id }" @click="_handleAnchor">${e.text}</a></li>`) }</ul>
          </nav>
        </div>
        ${ this._elements.filter(elem => !this._isButton(elem)).map(elem => html`
          <uvalib-field .element="${Object.assign({}, elem)}" ></uvalib-field>
        `) }
        ${ this._elements.filter(elem => this._isButton(elem)).map(elem => html`
          <uvalib-field .element="${Object.assign({}, elem)}" ></uvalib-field>
        `) }
      </form>
    `;
  }

  _dispatchEvent(name, detail={}){
    if (name) {
      this.dispatchEvent(new CustomEvent(name, { detail: detail, bubbles: true, composed: true }));      
    }
  }

  /**
   * Parses the form page object.
   */
  _parseFormPage() {    
    let frmPg = this.formPage;
    let fields = Array();
    if (frmPg) {
      let form = JSON.parse(frmPg.webform);
      for (var key in form) {
        if (key.match(/^sect_/)) {
          for (var skey in form[key]) {
            if (skey.match(/^fld_/)) {
              this._preprocessField(form[key][skey]);
            }
          }
        }
        if (key.match(/^sect_|fld_|mkup_|btn_|authenticated|confirmation/)) {
          fields.push(form[key]);
          this._preprocessField(form[key]);
        }
      }
    }
    console.log("parseFormPage modified elements")
    this._elements = fields;   
  }

  /**
   * Set the value of a field depending on its type.
   */
  _preprocessField(fldObj) {
    let setVal;
    fldObj.valid = true;
    // for text field make sure the type matches up with the HTML input expected
    if (fldObj.type) {
      fldObj.type = fldObj.type == 'textfield'?
        'text':
        fldObj.type == 'managed_file'?
          'file':
          fldObj.type == 'checkboxes'?
            {}:  //need to override value specified by Drupal JSON output
            fldObj.type;
    }
  }

  /**
   * Check authenticated field value to determine if form requires NetBadge.
   */
  _isFormAuthenticated() {
    if ( this._elements && Array.isArray(this._elements) ) {
      let auth = this._elements.find( ( {title} ) => title==='authenticated' );
      this._authenticated = (auth && auth.value && auth.value == "yes");
    }
  }
}
