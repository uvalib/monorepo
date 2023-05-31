import{A as t,T as e}from"./query-assigned-elements-23ba9e4f.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const r=2;class s{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class i extends s{constructor(e){if(super(e),this.et=t,e.type!==r)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(r){if(r===t||null==r)return this.ft=void 0,this.et=r;if(r===e)return r;if("string"!=typeof r)throw Error(this.constructor.directiveName+"() called with a non-string value");if(r===this.et)return this.ft;this.et=r;const s=[r];return s.raw=s,this.ft={_$litType$:this.constructor.resultType,strings:s,values:[]}}}i.directiveName="unsafeHTML",i.resultType=1;const n=(t=>(...e)=>({_$litDirective$:t,values:e}))(i);export{n as o};
