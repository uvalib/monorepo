import { html, css, LitElement } from 'lit';

export class UvalibField extends LitElement {
  static get styles() {
    return css`
    `;
  }

  static get properties() {
    return {
      element: {type: Object},
      invalidValues: {type: Boolean}
    };
  }

  constructor() {
    super();
  }

  updated(changedProps) {
    super.updated(changedProps);
    if ( changedProps.has('element') ) {
      // element has been set
      if ( this._isSelect(this.element) ) import('./UvalibFieldSelect.js');
    }
  }

  render() {
    return html`
      ${ this._isSelect(this.element)? html`<uvalib-field-select id="${ this.element.webform_key }" .element="${ this.element }" value="${ this.element.value }" ?hidden="${!this._showField(this.element)}" ?invalid-values="${ this.invalidValues }" required-error="${this.element.required_error}" syntax-errors="${this.element.syntax_error}"></uvalib-field-select>`:'' }
    `;
  }

  _isSelect(el) {
    return (el.type && el.type == "select");
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

}

window.customElements.define('uvalib-field', UvalibField);

/*
${ this._elements.map(elem => html`
${ this._isSection(elem)? html`


  <div class="section" ?hidden="${ !this._showField(elem) }">
    <h2>${ elem.title }</h2>
    ${ this._getSectionFields(elem).map(fs_elem => html`
        ${ this._isMarkup(fs_elem)? html`<uvalib-field-html-markup id="${fs_elem.webform_key}" .element="${fs_elem}" ?hidden="${ !this._showField(fs_elem) }"></uvalib-field-html-markup>`:'' }
        ${ this._isField(fs_elem)? html`
          ${ this._isHidden(fs_elem)? html`<uvalib-field-hidden id="${fs_elem.webform_key}" .element="${fs_elem}" ?invalid-values="${ this._invalidValues }"></uvalib-field-hidden>`:'' }
          ${ this._isSelect(fs_elem)? html`<uvalib-field-select id="${ fs_elem.webform_key }" .element="${ fs_elem }" value="${fs_elem.value}" ?hidden="${fs_elem}" ?invalid-values="${ this._invalidValues }" required-error="${fs_elem.required_error}" syntax-errors="${fs_elem.syntax_error}"></uvalib-field-select>`:'' }
          ${ this._isRadios(fs_elem)? html`<uvalib-field-radios id="${fs_elem.webform_key}" .element="${fs_elem}" value="${fs_elem.value}" ?hidden="${ !this._showField(fs_elem) }" ?invalid-values="${ this._invalidValues }" required-error="${ fs_elem.required_error }" syntax-errors="${ fs_elem.syntax_error }"></uvalib-field-radios>`:'' }
          ${ this._isInput(fs_elem)? html`<uvalib-field-input id="${fs_elem.webform_key}" .element="${fs_elem}" value="${fs_elem.value}" ?hidden="${ !this._showField(fs_elem) }" ?invalid-values="${ this._invalidValues }" required-error="${ fs_elem.required_error }" syntax-errors="${fs_elem.syntax_error}"></uvalib-field-input>`:'' }
        `:'' }
        <template is="dom-if" if="[[_isField(fs_elem)]]">
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
  </div>      
`) }

${ this._isMarkup(elem)? html`<uvalib-field-html-markup id="${ elem.webform_key }" .element="${elem}" ?hidden="${ !this._showField(elem) }"></uvalib-field-html-markup>`:'' }
${ this._isField(elem)? html`

${ this._isHidden(elem)? html`<uvalib-field-hidden id="${ elem.webform_key }" .element="${ elem }" ?invalid-values="${ this._invalidValues }"></uvalib-field-hidden>`:'' }
${ this._isSelect(elem)? html`<uvalib-field-select id="${ elem.webform_key }" .element="${ elem }" value="${ elem.value }" ?hidden="${ !this._showField(elem) }" ?invalid-values="${ this._invalidValues }" required-error="${ elem.required_error }" syntax-errors="${ elem.syntax_error }"></uvalib-field-select>`:'' }
`:'' }
<h1>Foo</h1>        
`:'' }  
<template is="dom-if" if="[[_isField(elem)]]">
  <template is="dom-if" if="[[_isSelect(elem)]]">

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
/*

      <template is="dom-repeat" items="{{_elements}}" as="elem">
        <template is="dom-if" if="[[_isButton(elem)]]">
          <uvalib-field-button id="[[elem.webform_key]]" element="{{elem}}" hidden$="{{!_showField(elem,_refresh)}}"></uvalib-field-button>
          <div id="networkConnection" hidden$="{{_online}}">[[_offlineMessage(_online,_networkConnectionMsg)]]</div>
        </template>
      </template>        
        




      </form>      


    `;
*/    