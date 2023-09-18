function e(e,t,r,o){var i,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,o);else for(var c=e.length-1;c>=0;c--)(i=e[c])&&(a=(n<3?i(a):n>3?i(t,r,a):i(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a}function t(e,t,r,o){if("a"===r&&!o)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!o:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===r?o:"a"===r?o.call(e):o?o.value:t.get(e)}function r(e,t,r,o,i){if("m"===o)throw new TypeError("Private method is not writable");if("a"===o&&!i)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===o?i.call(e,r):i?i.value=r:t.set(e,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o=(e,t)=>"method"===t.kind&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(r){r.createProperty(t.key,e)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(r){r.createProperty(t.key,e)}};function i(e){return(t,r)=>void 0!==r?((e,t,r)=>{t.constructor.createProperty(r,e)})(e,t,r):o(e,t)
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}var n;null===(n=window.HTMLSlotElement)||void 0===n||n.prototype.assignedElements;export{e as _,r as a,t as b,i as n};
