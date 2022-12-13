import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SiteStyle } from '@uvalib/site-style';

export class SiteHours extends SiteStyle {
  
  @property({type: Number, attribute: 'day-count'}) dayCount = 7;

  // page of days/hours to display
  @property({type: Number}) page = 0;

  constructor(){
    super();
    this.resizeReactive();  // we need to serve up a different dom if mobile sized
  }

//  setPageZero
  
  render() {
    return html`
      <style>
        :host, site-hours {
          display:block;
          width: 100%;
          min-height: 100vh;
        }
        [hidden] {
          display: none !important;
        }
      </style>
      
      ${ (this.offsetWidth>600)? html`

      <table>
        <colgroup>
            <col></col>
            <!-- todo: be made [shady] if day is today -->
            ${[...Array(this.dayCount)].map(()=>html`
              <col></col>
            `)}
        </colgroup>
        <tr class="first-row">
          <td>
            <button class="smallButton" raised ?disabled=${!this.page} @click="this.setPageZero">Today</button>
            <button class="smallButton" raised ?hidden=${!this.page} @click=""
              <paper-button class="smallButton" raised hidden$="[[!page]]" on-tap="_pageDown">Previous</iron-icon></paper-button>
              <paper-button class="smallButton" raised on-tap="_pageUp">Next</iron-icon></paper-button>
          </td>
            <template is="dom-repeat" items="[[_days]]">
              <div class="th" role="columnheader">[[item.date]]<br />[[item.title]]</div>
            </template>
        </tr>

          <template is="dom-repeat" items="[[_libraries]]" as="library">
            <div class="tr" role="row" id$="[[library.slug]]-hours">
              <div class="td" role="gridcell"><a href="hours#[[library.slug]]">[[library.title]]</a></div>
              <template is="dom-repeat" items="[[_days]]" as="day">
                <div class="td" role="gridcell">
<template is="dom-if" if="[[_isZero(index)]]">              
                  <uvalib-model-realtime-override database="uvalib-occupancy" path$="[[_overridePath(library.slug)]]" timestamp default-value="Temporarily Closed">
                    [[_getOpenRange(library.libcalID,day.id,_times)]]
                  </uvalib-model-realtime-override>
</template>               
<template is="dom-if" if="[[!_isZero(index)]]">
  [[_getOpenRange(library.libcalID,day.id,_times)]]
</template>      
                </div>
              </template>
            </div>
          </template>
      </table>  

      `:html`

      <div class="layout vertical">
        <template is="dom-repeat" items="[[_libraries]]" as="library" on-rendered-item-count-changed="_handleAnchor">
          <template is="dom-if" if="[[library.libcalID]]">
            <paper-card id$="[[library.slug]]-hours" heading="[[library.title]]" on-tap="_cardTap">
                <div class="card-content">
                  <div class="current-times" closed$="[[_isClosed(library.libcalID,_times,_refresh)]]">
                    <uvalib-model-realtime-override database="uvalib-occupancy" path$="[[_overridePath(library.slug)]]" timestamp default-value="Temporarily Closed">
                      [[_getRange(library.libcalID,_times,_refresh)]]
                    </uvalib-model-realtime-override>
                  </div>
                  <div class="extended-info">
                    <div>
                      <paper-button raised disabled$="[[!page]]" on-tap="_setPageZero">Today</paper-button>
                      <paper-button raised hidden$="[[!page]]" on-tap="_pageDown">Previous</iron-icon></paper-button>
                      <paper-button raised on-tap="_pageUp">Next</iron-icon></paper-button>
                    </div>
                    <div class="days">
                      <template is="dom-repeat" items="[[_days]]" as="day">
                        <div class="date-row layout horizontal around-justified">
                          <div class="date flex">
                            [[day.title]] [[day.date]]
                          </div>
                          <div class="hours flex">
                              [[_getOpenRange(library.libcalID,day.id,_times)]]
                          </div>
                        </div>
                      </template>
                    </div>
                    <div>
                      <paper-button raised id="map-[[library.id]]" on-tap="_mapIt">Map it</paper-button>
                    </div>
                  </div>
                </div>
            </paper-card>  

      ` }

    `;
  }
}
