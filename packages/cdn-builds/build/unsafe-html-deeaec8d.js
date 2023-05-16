import{l as t,x as r}from"./query-assigned-elements-9f2025bb.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const e=2;class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,r,e){this._$Ct=t,this._$AM=r,this._$Ci=e}_$AS(t,r){return this.update(t,r)}update(t,r){return this.render(...r)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class s extends i{constructor(r){if(super(r),this.it=t,r.type!==e)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===t||null==e)return this._t=void 0,this.it=e;if(e===r)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const i=[e];return i.raw=i,this._t={_$litType$:this.constructor.resultType,strings:i,values:[]}}}s.directiveName="unsafeHTML",s.resultType=1;const n=(t=>(...r)=>({_$litDirective$:t,values:r}))(s);export{n as o};
