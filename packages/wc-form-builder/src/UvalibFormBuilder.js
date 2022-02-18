import { html, css, LitElement } from 'lit';
import "@uvalib/uvalib-account/uvalib-account-user.js";
import "@uvalib/uvalib-data/uvalib-data.js";

export class UvalibFormBuilder extends LitElement {
  static get styles() {
    return css`
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
    };
  }

  constructor() {
    super();
    // defaults
    this._elements = {};
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

    }
    if ( changedProps.has('userInfo') ) {
      console.log( this.userInfo );
    }

  }

  _getFormDef(){
    if ( this.db && this.formId ) {
      this._gotFormOnce = true;
      this.db.getByChildKey('forms', 'target_id', 'purchase_requests').then(form => this.formPage = form );
    }
  }

  render() {
    return html`
      ${this._authenticated? html`<uvalib-account-user @contactInfo="${ e=>this.userInfo = e.detail.contactInfo }" auto></uvalib-account-user>`:''}

      <div class="field-label required-stmt">Fields marked with an asterisk (*) are required.</div>

      <form method="post" hidden$="[[!_visible]]">
        <input type="hidden" name="authenticated" value="[[_authenticated]]" />
  
        <div class="errors" hidden$="[[!_invalidValues]]" aria-live$="[[_alertLevel]]">
          <div id="submissionProblems">A problem has occurred.
            <div class="errorCount" hidden$="[[_firebaseProblem]]"> Please address the following <span inner-h-t-m-l="[[_errors.length]]"></span> <span inner-h-t-m-l="[[_errorString(_errors.length)]]"></span> and re-submit the form.</div>
          </div>
          <!--  insert error messages here after submit validation -->
          <nav id="errorList" aria-labelledby="submissionProblems" tabindex="0">
            <ul>
              <template is="dom-repeat" items="[[_errors]]">
                <li><a href="#[[item.id]]" on-click="_handleAnchor">[[item.text]]</a></li>
              </template>
            </ul>
          </nav>
        </div>
        <template is="dom-repeat" items="{{_elements}}" as="elem">
          <template is="dom-if" if="[[_isSection(elem)]]">
            <div class="section" hidden$="{{!_showField(elem,_refresh)}}">
              <h2>[[elem.title]]</h2>
                <template is="dom-repeat" items="{{_getSectionFields(elem)}}" as="fs_elem">
                  <template is="dom-if" if="[[_isMarkup(fs_elem)]]">
                    <uvalib-field-html-markup id="[[fs_elem.webform_key]]" element="{{fs_elem}}" hidden$="{{!_showField(fs_elem,_refresh)}}"></uvalib-field-html-markup>
                  </template>
                  <template is="dom-if" if="[[_isField(fs_elem)]]">
                    <template is="dom-if" if="[[_isHidden(fs_elem)]]">
                      <uvalib-field-hidden id="[[fs_elem.webform_key]]" element="{{fs_elem}}" invalid-values="{{_invalidValues}}"></uvalib-field-hidden>
                    </template>
                    <template is="dom-if" if="[[_isSelect(fs_elem)]]">
                      <uvalib-field-select counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}" hidden$="{{!_showField(fs_elem,_refresh)}}"
                        invalid-values="{{_invalidValues}}" required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-select>
                    </template>
                    <template is="dom-if" if="[[_isRadios(fs_elem)]]">
                      <uvalib-field-radios counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}" hidden$="{{!_showField(fs_elem,_refresh)}}"
                        invalid-values="{{_invalidValues}}" required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-radios>
                    </template>
                    <template is="dom-if" if="[[_isInput(fs_elem)]]">
                      <uvalib-field-input counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}" hidden$="{{!_showField(fs_elem,_refresh)}}"
                        invalid-values="{{_invalidValues}}" required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-input>
                    </template>
                    <template is="dom-if" if="[[_isFile(fs_elem)]]">
                      <uvalib-field-file counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}" hidden$="{{!_showField(fs_elem,_refresh)}}"
                        invalid-values="{{_invalidValues}}" required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-file>
                    </template>
                    <template is="dom-if" if="[[_isCheckbox(fs_elem)]]">
                      <uvalib-field-checkbox counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}" hidden$="{{!_showField(fs_elem,_refresh)}}"
                        invalid-values="{{_invalidValues}}" required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-checkbox>
                    </template>
                    <template is="dom-if" if="[[_isCheckboxes(fs_elem)]]">
                      <uvalib-field-checkboxes counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}" hidden$="{{!_showField(fs_elem,_refresh)}}"
                        invalid-values="{{_invalidValues}}" required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-checkboxes>
                    </template>
                    <template is="dom-if" if="[[_isTextarea(fs_elem)]]">
                      <uvalib-field-textarea counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}" hidden$="{{!_showField(fs_elem,_refresh)}}"
                        invalid-values="{{_invalidValues}}" required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
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
                        hidden$="[[!_showField(fs_elem,_refresh)]]" invalid-values="{{_invalidValues}}"
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
                        hidden$="[[!_showField(fs_elem,_refresh)]]" invalid-values="{{_invalidValues}}"
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
                        hidden$="[[!_showField(fs_elem,_refresh)]]" invalid-values="{{_invalidValues}}" header-height="[[_headerHeight]]"
                        required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-repeatable-session-datetime>
                    </template>
                    <template is="dom-if" if="[[_isRepeatableMediaClip(fs_elem)]]">
                      <uvalib-field-repeatable-clip-time counter="[[_counter]]" id="[[fs_elem.webform_key]]" element="{{fs_elem}}" value="{{fs_elem.value}}"
                        maximum-occurrences="[[fs_elem.maximum_occurrences]]" clip-label="[[fs_elem.clip_label]]"
                        hidden$="[[!_showField(fs_elem,_refresh)]]" invalid-values="{{_invalidValues}}" header-height="[[_headerHeight]]"
                        required-error="{{fs_elem.required_error}}" syntax-errors="{{fs_elem.syntax_error}}">
                      </uvalib-field-repeatable-clip-time>
                    </template>
                  </template>
      </template>
      </div>
      </template>
      <template is="dom-if" if="[[_isMarkup(elem)]]">
            <uvalib-field-html-markup id="[[elem.webform_key]]" element="{{elem}}" hidden$="{{!_showField(elem,_refresh)}}"></uvalib-field-html-markup>
          </template>
          <template is="dom-if" if="[[_isField(elem)]]">
            <template is="dom-if" if="[[_isHidden(elem)]]">
              <uvalib-field-hidden id="[[elem.webform_key]]" element="{{elem}}" invalid-values="{{_invalidValues}}"></uvalib-field-hidden>
            </template>
            <template is="dom-if" if="[[_isSelect(elem)]]">
              <uvalib-field-select counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                invalid-values="{{_invalidValues}}" required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-select>
            </template>
            <template is="dom-if" if="[[_isRadios(elem)]]">
              <uvalib-field-radios counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                invalid-values="{{_invalidValues}}"required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-radios>
            </template>
            <template is="dom-if" if="[[_isInput(elem)]]">
              <uvalib-field-input counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                invalid-values="{{_invalidValues}}" required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-input>
            </template>
            <template is="dom-if" if="[[_isFile(elem)]]">
              <uvalib-field-file counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                invalid-values="{{_invalidValues}}" required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-file>
            </template>
            <template is="dom-if" if="[[_isCheckbox(elem)]]">
              <uvalib-field-checkbox counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                invalid-values="{{_invalidValues}}" required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-checkbox>
            </template>
            <template is="dom-if" if="[[_isCheckboxes(elem)]]">
              <uvalib-field-checkboxes counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                invalid-values="{{_invalidValues}}" required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-checkboxes>
            </template>
            <template is="dom-if" if="[[_isTextarea(elem)]]">
              <uvalib-field-textarea counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}" hidden$="{{!_showField(elem,_refresh)}}"
                invalid-values="{{_invalidValues}}" required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-textarea>
            </template>
            <template is="dom-if" if="[[_isDateTime(elem)]]">
              <uvalib-field-datetime counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}"
                number-choice="[[elem.number_choice]]" date-label="[[elem.date_label]]" date-required="[[elem.date_required]]"
                start-time-label="[[elem.start_time_label]]" hide-start-time="[[elem.hide_start_time]]" start-time-required="[[elem.start_time_required]]"
                end-time-label="[[elem.end_time_label]]" hide-end-time="[[elem.hide_end_time]]" end-time-required="[[elem.end_time_required]]"
                minimum-days-out="[[elem.minimum_days_out]]" minute-step="[[elem.minute_step]]"
                hidden$="[[!_showField(elem,_refresh)]]" invalid-values="{{_invalidValues}}"
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
                hidden$="[[!_showField(elem,_refresh)]]" invalid-values="{{_invalidValues}}"
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
                hidden$="[[!_showField(elem,_refresh)]]" invalid-values="{{_invalidValues}}" header-height="[[_headerHeight]]"
                required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-repeatable-session-datetime>
            </template>
            <template is="dom-if" if="[[_isRepeatableMediaClip(elem)]]">
              <uvalib-field-repeatable-clip-time counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}"
                maximum-occurrences="[[elem.maximum_occurrences]]" clip-label="[[elem.clip_label]]"
                hidden$="[[!_showField(elem,_refresh)]]" invalid-values="{{_invalidValues}}" header-height="[[_headerHeight]]"
                required-error="{{elem.required_error}}" syntax-errors="{{elem.syntax_error}}">
              </uvalib-field-repeatable-clip-time>
            </template>
            <template is="dom-if" if="[[_isCaptcha(elem)]]">
              <uvalib-field-email-verify counter="[[_counter]]" id="[[elem.webform_key]]" element="{{elem}}" value="{{elem.value}}"></uvalib-field-email-verify>
            </template>
      </template>
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
