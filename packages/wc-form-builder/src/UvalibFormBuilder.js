import { html, css, LitElement } from 'lit';
import "@uvalib/uvalib-account/uvalib-account-user.js";
import "@uvalib/uvalib-data/uvalib-data.js";
import "./UvalibFieldHTMLMarkup.js";
import "./UvalibFieldHidden.js";

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

  _showField(item) {
    if (!item.states) {
      return true;
    } else if (item.states && item.states.visible && item.states.invisible) {
      return (this._testState(item.states.invisible)) ? false : this._testState(item.states.visible);
    } else if (item.states && item.states.invisible) {
      return !this._testState(item.states.invisible);
    } else if (item.states && item.states.visible) {
      return this._testState(item.states.visible);
    } else if (item.states && item.states.required) {
      return this._testState(item.states.required);
    }
  }

  _testState(state) {
    if (Array.isArray(state)) {
        for (var i = 0; i < state.length; i = i + 2) {
            if (this._testField(state[i])) return true;
        }
        return false;
    } else {
        return this._testField(state);
    }
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

        ${ this._elements.filter(elem=>this._isSection(elem)).map(elem => html`

            <div class="section" ?hidden="${ !this._showField(elem) }">
              <h2>${ elem.title }</h2>

              ${ this._getSectionFields(elem).map(fs_elem => html`
                  ${ this._isMarkup(fs_elem)? html`<uvalib-field-html-markup id="${fs_elem.webform_key}" .element="${fs_elem}" ?hidden="${ !this._showField(fs_elem) }"></uvalib-field-html-markup>`:'' }
                  ${ this._isField(fs_elem)? html`
                    ${ this._isHidden(fs_elem)? html`<uvalib-field-hidden id="${fs_elem.webform_key}" .element="${fs_elem}" ?invalid-values="${ this._invalidValues }"></uvalib-field-hidden>`:'' }
                    ${ this._isSelect(fs_elem)? html`<uvalib-field-select id="${ fs_elem.webform_key }" .element="${ fs_elem }" value="${fs_elem.value}" ?hidden="${fs_elem}" ?invalid-values="${ this._invalidValues }" required-error="${fs_elem.required_error}" syntax-errors="${fs_elem.syntax_error}"></uvalib-field-select>`:'' }
                    ${ this._isRadios(fs_elem)? html`<uvalib-field-radios id="${fs_elem.webform_key}" .element="${fs_elem}" value="${fs_elem.value}" ?hidden="${ !this._showField(fs_elem) }" ?invalid-values="${ this._invalidValues }" required-error="${ fs_elem.required_error }" syntax-errors="${ fs_elem.syntax_error }"></uvalib-field-radios>`:'' }
                  `:'' }
                  <template is="dom-if" if="[[_isField(fs_elem)]]">

                    <template is="dom-if" if="[[_isInput(fs_elem)]]">
                      <uvalib-field-input counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}" hidden$="{{!_showField(fs_elem,_refresh)}}"
                        ?invalid-values="${ this._invalidValues }" required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-input>
                    </template>
                    <template is="dom-if" if="[[_isFile(fs_elem)]]">
                      <uvalib-field-file counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}" hidden$="{{!_showField(fs_elem,_refresh)}}"
                        ?invalid-values="${ this._invalidValues }" required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-file>
                    </template>
                    <template is="dom-if" if="[[_isCheckbox(fs_elem)]]">
                      <uvalib-field-checkbox counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}" hidden$="{{!_showField(fs_elem,_refresh)}}"
                        ?invalid-values="${ this._invalidValues }" required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-checkbox>
                    </template>
                    <template is="dom-if" if="[[_isCheckboxes(fs_elem)]]">
                      <uvalib-field-checkboxes counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}" hidden$="{{!_showField(fs_elem,_refresh)}}"
                        ?invalid-values="${ this._invalidValues }" required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-checkboxes>
                    </template>
                    <template is="dom-if" if="[[_isTextarea(fs_elem)]]">
                      <uvalib-field-textarea counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}" hidden$="{{!_showField(fs_elem,_refresh)}}"
                        ?invalid-values="${ this._invalidValues }" required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-textarea>
                    </template>
                    <template is="dom-if" if="[[_isButton(fs_elem)]]">
                      <uvalib-field-button id="[[fs_elem.webform_key]]" element="{{fs_elem}}" hidden$="{{!_showField(fs_elem,_refresh)}}"></uvalib-field-button>
                    </template>
                    <template is="dom-if" if="[[_isDateTime(fs_elem)]]">
                      <uvalib-field-datetime counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}"
                        number-choice="[[fs_elem.number_choice]]" date-label="[[fs_elem.date_label]]" date-required="[[fs_elem.date_required]]"
                        start-time-label="[[fs_elem.start_time_label]]" hide-start-time="[[fs_elem.hide_start_time]]" start-time-required="[[fs_elem.start_time_required]]"
                        end-time-label="[[fs_elem.end_time_label]]" hide-end-time="[[fs_elem.hide_end_time]]" end-time-required="[[fs_elem.end_time_required]]"
                        minimum-days-out="[[fs_elem.minimum_days_out]]" minute-step="[[fs_elem.minute_step]]"
                        hidden$="[[!_showField(fs_elem,_refresh)]]" ?invalid-values="${ this._invalidValues }"
                        required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-datetime>
                    </template>
                    <template is="dom-if" if="[[_isSessionDateTimes(fs_elem)]]">
                      <uvalib-field-session-datetime counter="[[_counter]]" id="[[fs_elem.webform_key]]"
                        element="{{fs_elem}}" value="{{fs_elem.value}}" number-choices="[[fs_elem.number_choices]]"
                        num-choices-required="[[fs_elem.num_choices_required]]" include-session-length="[[fs_elem.include_session_length]]"
                        session-label="[[fs_elem.session_label]]" date-required="[[fs_elem.date_required]]"
                        hide-start-time="[[fs_elem.hide_start_time]]" start-time-required="[[fs_elem.start_time_required]]" start-time-label="[[fs_elem.start_time_label]]"
                        hide-end-time="[[fs_elem.hide_end_time]]" end-time-required="[[fs_elem.end_time_required]]" end-time-label="[[fs_elem.end_time_label]]"
                        minimum-days-out="[[fs_elem.minimum_days_out]]" minute-step="[[fs_elem.minute_step]]"
                        hidden$="[[!_showField(fs_elem,_refresh)]]" ?invalid-values="${ this._invalidValues }"
                        required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-session-datetime>
                    </template>
                    <template is="dom-if" if="[[_isSectionSelect(fs_elem)]]">
                      <uvalib-sis-input counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}" hidden$="{{!_showField(fs_elem,_refresh)}}" course-default-value$="{{fs_elem.course_default_value}}" show-alternate$="{{fs_elem.show_alternate}}" show-enrollment$="{{fs_elem.show_enrollment}}" show-meeting-time$="{{fs_elem.show_meeting_time}}"></uvalib-sis-input>
                    </template>
                    <template is="dom-if" if="[[_isRepeatableSession(fs_elem)]]">
                      <uvalib-field-repeatable-session-datetime counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}"
                        maximum-occurrences="[[fs_elem.maximum_occurrences]]" include-session-length="[[fs_elem.include_session_length]]"
                        number-choices="[[fs_elem.number_choices]]" num-choices-required="[[fs_elem.num_choices_required]]"
                        session-label="[[fs_elem.session_label]]" date-required="[[fs_elem.date_required]]"
                        hide-start-time="[[fs_elem.hide_start_time]]" start-time-required="[[fs_elem.start_time_required]]" start-time-label="[[fs_elem.start_time_label]]"
                        hide-end-time="[[fs_elem.hide_end_time]]" end-time-required="[[fs_elem.end_time_required]]" end-time-label="[[fs_elem.end_time_label]]"
                        minimum-days-out="[[fs_elem.minimum_days_out]]" minute-step="[[fs_elem.minute_step]]"
                        hidden$="[[!_showField(fs_elem,_refresh)]]" ?invalid-values="${ this._invalidValues }" header-height="[[_headerHeight]]"
                        required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-repeatable-session-datetime>
                    </template>
                    <template is="dom-if" if="[[_isRepeatableMediaClip(fs_elem)]]">
                      <uvalib-field-repeatable-clip-time counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}"
                        maximum-occurrences="[[fs_elem.maximum_occurrences]]" clip-label="[[fs_elem.clip_label]]"
                        hidden$="[[!_showField(fs_elem,_refresh)]]" ?invalid-values="${ this._invalidValues }" header-height="[[_headerHeight]]"
                        required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-repeatable-clip-time>
                    </template>
                  
      `) }

      </template>
      
      </div>

      <template is="dom-if" if="[[_isMarkup(elem)]]">
            <uvalib-field-html-markup id="[[elem.webform_key]]" element="{{elem}}" hidden$="{{!_showField(elem,_refresh)}}"></uvalib-field-html-markup>
          </template>
          <template is="dom-if" if="[[_isField(elem)]]">
            ${ this._isHidden(elem)? html`
              <uvalib-field-hidden id="${ elem.webform_key }" .element="${ elem }" ?invalid-values="${ this._invalidValues }"></uvalib-field-hidden>
            `:'' }
            <template is="dom-if" if="[[_isHidden(elem)]]">
              
            </template>
            <template is="dom-if" if="[[_isSelect(elem)]]">
              <uvalib-field-select counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                ?invalid-values="${ this._invalidValues }" required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-select>
            </template>
            <template is="dom-if" if="[[_isRadios(elem)]]">
              <uvalib-field-radios counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                ?invalid-values="${ this._invalidValues }"required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-radios>
            </template>
            <template is="dom-if" if="[[_isInput(elem)]]">
              <uvalib-field-input counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                ?invalid-values="${ this._invalidValues }" required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-input>
            </template>
            <template is="dom-if" if="[[_isFile(elem)]]">
              <uvalib-field-file counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                ?invalid-values="${ this._invalidValues }" required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-file>
            </template>
            <template is="dom-if" if="[[_isCheckbox(elem)]]">
              <uvalib-field-checkbox counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                ?invalid-values="${ this._invalidValues }" required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-checkbox>
            </template>
            <template is="dom-if" if="[[_isCheckboxes(elem)]]">
              <uvalib-field-checkboxes counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                ?invalid-values="${ this._invalidValues }" required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-checkboxes>
            </template>
            <template is="dom-if" if="[[_isTextarea(elem)]]">
              <uvalib-field-textarea counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                ?invalid-values="${ this._invalidValues }" required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-textarea>
            </template>
            <template is="dom-if" if="[[_isDateTime(elem)]]">
              <uvalib-field-datetime counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}"
                number-choice="[[elem.number_choice]]" date-label="[[elem.date_label]]" date-required="[[elem.date_required]]"
                start-time-label="[[elem.start_time_label]]" hide-start-time="[[elem.hide_start_time]]" start-time-required="[[elem.start_time_required]]"
                end-time-label="[[elem.end_time_label]]" hide-end-time="[[elem.hide_end_time]]" end-time-required="[[elem.end_time_required]]"
                minimum-days-out="[[elem.minimum_days_out]]" minute-step="[[elem.minute_step]]"
                hidden$="[[!_showField(elem,_refresh)]]" ?invalid-values="${ this._invalidValues }"
                required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-datetime>
            </template>
            <template is="dom-if" if="[[_isSessionDateTimes(elem)]]">
              <uvalib-field-session-datetime counter="[[_counter]]" id="[[elem.webform_key]]"
                element="{{elem}}" value="{{elem.value}}" number-choices="[[elem.number_choices]]"
                num-choices-required="[[elem.num_choices_required]]" include-session-length="[[elem.include_session_length]]"
                session-label="[[elem.session_label]]" date-required="[[elem.date_required]]"
                hide-start-time="[[elem.hide_start_time]]" start-time-required="[[elem.start_time_required]]" start-time-label="[[elem.start_time_label]]"
                hide-end-time="[[elem.hide_end_time]]" end-time-required="[[elem.end_time_required]]" end-time-label="[[elem.end_time_label]]"
                minimum-days-out="[[elem.minimum_days_out]]" minute-step="[[elem.minute_step]]"
                hidden$="[[!_showField(elem,_refresh)]]" ?invalid-values="${ this._invalidValues }"
                required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-session-datetime>
            </template>
            <template is="dom-if" if="[[_isSectionSelect(elem)]]">
              <uvalib-sis-input counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}" course-default-value$="{{elem.course_default_value}}" show-alternate$="{{elem.show_alternate}}" show-enrollment$="{{elem.show_enrollment}}" show-meeting-time$="{{fs_elem.show_meeting_time}}"></uvalib-sis-input>
            </template>
            <template is="dom-if" if="[[_isRepeatableSession(elem)]]">
              <uvalib-field-repeatable-session-datetime counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}"
                maximum-occurrences="[[fs_elem.maximum_occurrences]]" include-session-length="[[elem.include_session_length]]"
                number-choices="[[elem.number_choices]]" num-choices-required="[[elem.num_choices_required]]"
                session-label="[[elem.session_label]]" date-required="[[elem.date_required]]"
                hide-start-time="[[elem.hide_start_time]]" start-time-required="[[elem.start_time_required]]" start-time-label="[[elem.start_time_label]]"
                hide-end-time="[[elem.hide_end_time]]" end-time-required="[[elem.end_time_required]]" end-time-label="[[elem.end_time_label]]"
                minimum-days-out="[[elem.minimum_days_out]]" minute-step="[[elem.minute_step]]"
                hidden$="[[!_showField(elem,_refresh)]]" ?invalid-values="${ this._invalidValues }" header-height="[[_headerHeight]]"
                required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-repeatable-session-datetime>
            </template>
            <template is="dom-if" if="[[_isRepeatableMediaClip(elem)]]">
              <uvalib-field-repeatable-clip-time counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}"
                maximum-occurrences="[[elem.maximum_occurrences]]" clip-label="[[elem.clip_label]]"
                hidden$="[[!_showField(elem,_refresh)]]" ?invalid-values="${ this._invalidValues }" header-height="[[_headerHeight]]"
                required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-repeatable-clip-time>
            </template>
            <template is="dom-if" if="[[_isCaptcha(elem)]]">
              <uvalib-field-email-verify counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}"></uvalib-field-email-verify>
            </template>
      </template>

      `) }

      </template>
      <template is="dom-repeat" items="{{_elements}}" as="elem">
        <template is="dom-if" if="[[_isButton(elem)]]">
          <uvalib-field-button id="[[elem.webform_key]]" element="{{elem}}" hidden$="{{!_showField(elem,_refresh)}}"></uvalib-field-button>
          <div id="networkConnection" hidden$="{{_online}}">[[_offlineMessage(_online,_networkConnectionMsg)]]</div>
        </template>
      </template>        
        




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
