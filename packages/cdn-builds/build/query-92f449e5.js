/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=(t,e,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,r),r)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;function e(e,r){return(n,o,c)=>{const l=t=>t.renderRoot?.querySelector(e)??null;if(r){const{get:e,set:r}="object"==typeof o?n:c??(()=>{const t=Symbol();return{get(){return this[t]},set(e){this[t]=e}}})();return t(n,o,{get(){let t=e.call(this);return void 0===t&&(t=l(this),(null!==t||this.hasUpdated)&&r.call(this,t)),t}})}return t(n,o,{get(){return l(this)}})}}export{e};
