import { _ as __decorate, s, e } from './query-assigned-elements-66a11629.js';

function parse_option(a,b){return "undefined"==typeof a?b:a}function create_object_array(a){const b=Array(a);for(let c=0;c<a;c++)b[c]=create_object();return b}function get_keys(a){return Object.keys(a)}function create_object(){return Object.create(null)}function concat(a){return [].concat.apply([],a)}function sort_by_length_down(c,a){return a.length-c.length}function is_array(a){return a.constructor===Array}function is_string(a){return "string"==typeof a}function is_object(a){return "object"==typeof a}function is_function(a){return "function"==typeof a}

function pipeline(a,b,c,d){if(a&&(b&&(a=replace(a,b)),this.matcher&&(a=replace(a,this.matcher)),this.stemmer&&1<a.length&&(a=replace(a,this.stemmer)),d&&1<a.length&&(a=collapse(a)),c||""===c)){const b=a.split(c);return this.filter?filter(b,this.filter):b}return a}const regex_whitespace=/[\p{Z}\p{S}\p{P}\p{C}]+/u;function init_filter(a){const b=create_object();for(let c=0,d=a.length;c<d;c++)b[a[c]]=1;return b}function init_stemmer_or_matcher(a,b){const c=get_keys(a),d=c.length,e=[];let f="",g=0;for(let h,j,k=0;k<d;k++)h=c[k],j=a[h],j?(e[g++]=regex(b?"(?!\\b)"+h+"(\\b|_)":h),e[g++]=j):f+=(f?"|":"")+h;return f&&(e[g++]=regex(b?"(?!\\b)("+f+")(\\b|_)":"("+f+")"),e[g]=""),e}function replace(a,b){for(let c=0,d=b.length;c<d&&(a=a.replace(b[c],b[c+1]),!!a);c+=2);return a}function regex(a){return new RegExp(a,"g")}function collapse(a){let b="",c="";for(let d,e=0,f=a.length;e<f;e++)(d=a[e])!==c&&(b+=c=d);return b}function filter(a,b){const c=a.length,d=[];for(let e=0,f=0;e<c;e++){const c=a[e];c&&!b[c]&&(d[f++]=c);}return d}

function encode(a){return pipeline.call(this,(""+a).toLowerCase(),!1,regex_whitespace,!1)}

const global_lang={};const global_charset={};

function apply_async(a){register$1(a,"add"),register$1(a,"append"),register$1(a,"search"),register$1(a,"update"),register$1(a,"remove");}function register$1(a,b){a[b+"Async"]=function(){const a=this,c=arguments,d=c[c.length-1];let e;is_function(d)&&(e=d,delete c[c.length-1]);const f=new Promise(function(d){setTimeout(function(){a.async=!0;const e=a[b].apply(a,c);a.async=!1,d(e);});});return e?(f.then(e),this):f};}

function intersect(a,b,c,d){const e=a.length;let f,g,h=[],i=0;d&&(d=[]);for(let j=e-1;0<=j;j--){const k=a[j],l=k.length,m=create_object();let n=!f;for(let a=0;a<l;a++){const l=k[a],o=l.length;if(o)for(let a,k,p=0;p<o;p++)if(k=l[p],f){if(f[k]){if(!j)if(c)c--;else if(h[i++]=k,i===b)return h;(j||d)&&(m[k]=1),n=!0;}if(d&&(a=(g[k]||0)+1,g[k]=a,a<e)){const b=d[a-2]||(d[a-2]=[]);b[b.length]=k;}}else m[k]=1;}if(d)f||(g=m);else if(!n)return [];f=m;}if(d)for(let a,e,g=d.length-1;0<=g;g--){a=d[g],e=a.length;for(let d,g=0;g<e;g++)if(d=a[g],!f[d]){if(c)c--;else if(h[i++]=d,i===b)return h;f[d]=1;}}return h}function intersect_union(a,b){const c=create_object(),d=create_object(),e=[];for(let d=0;d<a.length;d++)c[a[d]]=1;for(let f,g=0;g<b.length;g++){f=b[g];for(let a,b=0;b<f.length;b++)a=f[b],c[a]&&!d[a]&&(d[a]=1,e[e.length]=a);}return e}

function CacheClass(a){this.limit=!0!==a&&a,this.cache=create_object(),this.queue=[];}function searchCache(a,b,c){is_object(a)&&(a=a.query);let d=this.cache.get(a);return d||(d=this.search(a,b,c),this.cache.set(a,d)),d}CacheClass.prototype.set=function(a,b){if(!this.cache[a]){let b=this.queue.length;b===this.limit?delete this.cache[this.queue[b-1]]:b++;for(let a=b-1;0<a;a--)this.queue[a]=this.queue[a-1];this.queue[0]=a;}this.cache[a]=b;},CacheClass.prototype.get=function(a){const b=this.cache[a];if(this.limit&&b){const b=this.queue.indexOf(a);if(b){const a=this.queue[b-1];this.queue[b-1]=this.queue[b],this.queue[b]=a;}}return b},CacheClass.prototype.del=function(a){for(let b,c,d=0;d<this.queue.length;d++)c=this.queue[d],b=this.cache[c],b.includes(a)&&(this.queue.splice(d--,1),delete this.cache[c]);};

const preset={memory:{charset:"latin:extra",resolution:3,minlength:4,fastupdate:!1},performance:{resolution:3,minlength:3,optimize:!1,context:{depth:2,resolution:1}},match:{charset:"latin:extra",tokenize:"reverse"},score:{charset:"latin:advanced",resolution:20,minlength:3,context:{depth:3,resolution:9}},default:{}};function apply_preset(a){if(is_string(a))a=preset[a];else {const b=a.preset;b&&(a=Object.assign({},b[b],a));}return a}

function async(a,b,c,d,e,f,g){setTimeout(function(){const h=a(c?c+"."+d:d,JSON.stringify(g));h&&h.then?h.then(function(){b.export(a,b,c,e,f+1);}):b.export(a,b,c,e,f+1);});}function exportIndex(a,b,c,d,e){let f,g;switch(e||(e=0)){case 0:if(f="reg",this.fastupdate)for(let a in g=create_object(),this.register)g[a]=1;else g=this.register;break;case 1:f="cfg",g={doc:0,opt:this.optimize?1:0};break;case 2:f="map",g=this.map;break;case 3:f="ctx",g=this.ctx;break;default:return;}return async(a,b||this,c,f,d,e,g),!0}function importIndex(a,b){b&&(is_string(b)&&(b=JSON.parse(b)),"cfg"===a?this.optimize=!!b.opt:"reg"===a?(this.fastupdate=!1,this.register=b):"map"===a?this.map=b:"ctx"===a?this.ctx=b:void 0);}function exportDocument(a,b,c,d,e){if(e||(e=0),d||(d=0),d<this.field.length){const c=this.field[d],f=this.index[c];b=this,setTimeout(function(){f.export(a,b,e?c:"",d,e++)||(d++,e=1,b.export(a,b,c,d,e));});}else {let b,f;switch(e){case 1:b="tag",f=this.tagindex;break;case 2:b="store",f=this.store;break;default:return;}async(a,this,c,b,d,e,f);}}function importDocument(a,b){if(b)switch(is_string(b)&&(b=JSON.parse(b)),a){case"tag":this.tagindex=b;break;case"reg":this.fastupdate=!1,this.register=b;for(let a,c=0;c<this.field.length;c++)a=this.index[this.field[c]],a.register=b,a.fastupdate=!1;break;case"store":this.store=b;break;default:a=a.split(".");const c=a[0];a=a[1],c&&a&&this.index[c].import(a,b);}}

function Index(a,b){if(!(this instanceof Index))return new Index(a);let c,d,e;a?((a=apply_preset(a)),c=a.charset,d=a.lang,is_string(c)&&(-1===c.indexOf(":")&&(c+=":default"),c=global_charset[c]),is_string(d)&&(d=global_lang[d])):a={};let f,g,h=a.context||{};this.encode=a.encode||c&&c.encode||encode,this.register=b||create_object(),this.resolution=f=a.resolution||9,this.tokenize=e=c&&c.tokenize||a.tokenize||"strict",this.depth="strict"===e&&h.depth,this.bidirectional=parse_option(h.bidirectional,!0),this.optimize=g=parse_option(a.optimize,!0),this.fastupdate=parse_option(a.fastupdate,!0),this.minlength=a.minlength||1,this.boost=a.boost,this.map=g?create_object_array(f):create_object(),this.resolution_ctx=f=h.resolution||1,this.ctx=g?create_object_array(f):create_object(),this.rtl=c&&c.rtl||a.rtl,this.matcher=(e=a.matcher||d&&d.matcher)&&init_stemmer_or_matcher(e,!1),this.stemmer=(e=a.stemmer||d&&d.stemmer)&&init_stemmer_or_matcher(e,!0),this.filter=(e=a.filter||d&&d.filter)&&init_filter(e),(this.cache=(e=a.cache)&&new CacheClass(e));}Index.prototype.append=function(a,b){return this.add(a,b,!0)},Index.prototype.add=function(a,b,c,d){if(b&&(a||0===a)){if(!d&&!c&&this.register[a])return this.update(a,b);b=this.encode(""+b);const e=b.length;if(e){const d=create_object(),f=create_object(),g=this.depth,h=this.resolution;for(let j=0;j<e;j++){let i=b[this.rtl?e-1-j:j],k=i.length;if(i&&k>=this.minlength&&(g||!f[i])){let l=get_score(h,e,j),m="";switch(this.tokenize){case"full":if(2<k){for(let b=0;b<k;b++)for(let d=k;d>b;d--)if(d-b>=this.minlength){const g=get_score(h,e,j,k,b);m=i.substring(b,d),this.push_index(f,m,g,a,c);}break}case"reverse":if(1<k){for(let b=k-1;0<b;b--)if(m=i[b]+m,m.length>=this.minlength){const d=get_score(h,e,j,k,b);this.push_index(f,m,d,a,c);}m="";}case"forward":if(1<k){for(let b=0;b<k;b++)m+=i[b],m.length>=this.minlength&&this.push_index(f,m,l,a,c);break}default:if(this.boost&&(l=Math.min(0|l/this.boost(b,i,j),h-1)),this.push_index(f,i,l,a,c),g&&1<e&&j<e-1){const f=create_object(),h=this.resolution_ctx,k=i,l=Math.min(g+1,e-j);f[k]=1;for(let g=1;g<l;g++)if(i=b[this.rtl?e-1-j-g:j+g],i&&i.length>=this.minlength&&!f[i]){f[i]=1;const b=get_score(h+(e/2>h?0:1),e,j,l-1,g-1),m=this.bidirectional&&i>k;this.push_index(d,m?k:i,b,a,c,m?i:k);}}}}}this.fastupdate||(this.register[a]=1);}}return this};function get_score(a,b,c,d,e){return c&&1<a?b+(d||0)<=a?c+(e||0):0|(a-1)/(b+(d||0))*(c+(e||0))+1:0}Index.prototype.push_index=function(a,b,c,d,e,f){let g=f?this.ctx:this.map;if((!a[b]||f&&!a[b][f])&&(this.optimize&&(g=g[c]),f?(a=a[b]||(a[b]=create_object()),a[f]=1,g=g[f]||(g[f]=create_object())):a[b]=1,g=g[b]||(g[b]=[]),this.optimize||(g=g[c]||(g[c]=[])),(!e||!g.includes(d))&&(g[g.length]=d,this.fastupdate))){const a=this.register[d]||(this.register[d]=[]);a[a.length]=g;}},Index.prototype.search=function(a,b,c){c||(!b&&is_object(a)?(c=a,a=c.query):is_object(b)&&(c=b));let d,e,f,g=[],h=0;if(c&&(a=c.query||a,b=c.limit,h=c.offset||0,e=c.context,f=c.suggest),a&&(a=this.encode(""+a),d=a.length,1<d)){const b=create_object(),c=[];for(let e,h=0,i=0;h<d;h++)if(e=a[h],e&&e.length>=this.minlength&&!b[e]){if(!this.optimize&&!f&&!this.map[e])return g;c[i++]=e,b[e]=1;}a=c,d=a.length;}if(!d)return g;b||(b=100);let i,j=this.depth&&1<d&&!1!==e,k=0;j?(i=a[0],k=1):1<d&&a.sort(sort_by_length_down);for(let e,l;k<d;k++){if(l=a[k],j?(e=this.add_result(g,f,b,h,2===d,l,i),(!f||!1!==e||!g.length)&&(i=l)):e=this.add_result(g,f,b,h,1===d,l),e)return e;if(f&&k==d-1){let a=g.length;if(!a){if(j){j=0,k=-1;continue}return g}if(1===a)return single_result(g[0],b,h)}}return intersect(g,b,h,f)},Index.prototype.add_result=function(a,b,c,d,e,f,g){let h=[],i=g?this.ctx:this.map;if(this.optimize||(i=get_array(i,f,g,this.bidirectional)),i){let b=0;const j=Math.min(i.length,g?this.resolution_ctx:this.resolution);for(let a,k,l=0,m=0;l<j&&(a=i[l],!(a&&(this.optimize&&(a=get_array(a,f,g,this.bidirectional)),d&&a&&e&&(k=a.length,k<=d?(d-=k,a=null):(a=a.slice(d),d=0)),a&&(h[b++]=a,e&&(m+=a.length,m>=c)))));l++);if(b)return e?single_result(h,c,0):void(a[a.length]=h)}return !b&&h};function single_result(a,b,c){return a=1===a.length?a[0]:concat(a),c||a.length>b?a.slice(c,c+b):a}function get_array(a,b,c,d){if(c){const e=d&&b>c;a=a[e?b:c],a=a&&a[e?c:b];}else a=a[b];return a}Index.prototype.contain=function(a){return !!this.register[a]},Index.prototype.update=function(a,b){return this.remove(a).add(a,b)},Index.prototype.remove=function(a,b){const c=this.register[a];if(c){if(this.fastupdate)for(let b,d=0;d<c.length;d++)b=c[d],b.splice(b.indexOf(a),1);else remove_index(this.map,a,this.resolution,this.optimize),this.depth&&remove_index(this.ctx,a,this.resolution_ctx,this.optimize);b||delete this.register[a],this.cache&&this.cache.del(a);}return this};function remove_index(a,b,c,d,e){let f=0;if(!is_array(a))for(let g in a)f=remove_index(a[g],b,c,d,e),f||delete a[g];else if(!e){e=Math.min(a.length,c);for(let g,h=0;h<e;h++)g=a[h],g&&(f=remove_index(g,b,c,d,e),!d&&!f&&delete a[h]);}else {const c=a.indexOf(b);-1===c?f++:1<a.length&&(a.splice(c,1),f++);}return f}(Index.prototype.searchCache=searchCache),(Index.prototype.export=exportIndex,Index.prototype.import=importIndex),apply_async(Index.prototype);

function handler(a){a=a.data;const b=self._index,c=a.args,d=a.task;switch(d){case"init":const e=a.options||{},f=a.factory,g=e.encode;e.cache=!1,g&&0===g.indexOf("function")&&(e.encode=Function("return "+g)()),f?(Function("return "+f)()(self),self._index=new self.FlexSearch.Index(e),delete self.FlexSearch):self._index=new Index(e);break;default:const h=a.id,i=b[d].apply(b,c);postMessage("search"===d?{id:h,msg:i}:{id:h});}}

let pid=0;function WorkerIndex(a){if(!(this instanceof WorkerIndex))return new WorkerIndex(a);let b;a?is_function(b=a.encode)&&(a.encode=b.toString()):a={};let c=(self||window)._factory;c&&(c=c.toString());const d="undefined"==typeof window&&self.exports,e=this;this.worker=create(c,d,a.worker),this.resolver=create_object();this.worker&&(d?this.worker.on("message",function(a){e.resolver[a.id](a.msg),delete e.resolver[a.id];}):this.worker.onmessage=function(a){a=a.data,e.resolver[a.id](a.msg),delete e.resolver[a.id];},this.worker.postMessage({task:"init",factory:c,options:a}));}register("add"),register("append"),register("search"),register("update"),register("remove");function register(a){WorkerIndex.prototype[a]=WorkerIndex.prototype[a+"Async"]=function(){const b=this,c=[].slice.call(arguments),d=c[c.length-1];let e;is_function(d)&&(e=d,c.splice(c.length-1,1));const f=new Promise(function(d){setTimeout(function(){b.resolver[++pid]=d,b.worker.postMessage({task:a,id:pid,args:c});});});return e?(f.then(e),this):f};}function create(factory,is_node_js,worker_path){let worker;try{worker=is_node_js?eval("new (require(\"worker_threads\")[\"Worker\"])(\"../dist/node/node.js\")"):factory?new Worker(URL.createObjectURL(new Blob(["onmessage="+handler.toString()],{type:"text/javascript"}))):new Worker(is_string(worker_path)?worker_path:"worker/worker.js",{type:"module"});}catch(a){}return worker}

function Document(a){if(!(this instanceof Document))return new Document(a);const b=a.document||a.doc||a;let c;this.tree=[],this.field=[],this.marker=[],this.register=create_object(),this.key=(c=b.key||b.id)&&parse_tree(c,this.marker)||"id",this.fastupdate=parse_option(a.fastupdate,!0),(this.storetree=(c=b.store)&&!0!==c&&[],this.store=c&&create_object()),(this.tag=(c=b.tag)&&parse_tree(c,this.marker),this.tagindex=c&&create_object()),(this.cache=(c=a.cache)&&new CacheClass(c),a.cache=!1),(this.worker=a.worker),(this.async=!1),this.index=parse_descriptor.call(this,a,b);}function parse_descriptor(a,b){const c=create_object();let d=b.index||b.field||b;is_string(d)&&(d=[d]);for(let e,f,g=0;g<d.length;g++)e=d[g],is_string(e)||(f=e,e=e.field),f=is_object(f)?Object.assign({},a,f):a,this.worker&&(c[e]=new WorkerIndex(f),!c[e].worker&&(this.worker=!1)),this.worker||(c[e]=new Index(f,this.register)),this.tree[g]=parse_tree(e,this.marker),this.field[g]=e;if(this.storetree){let a=b.store;is_string(a)&&(a=[a]);for(let b=0;b<a.length;b++)this.storetree[b]=parse_tree(a[b],this.marker);}return c}function parse_tree(a,b){const c=a.split(":");let d=0;for(let e=0;e<c.length;e++)a=c[e],0<=a.indexOf("[]")&&(a=a.substring(0,a.length-2),a&&(b[d]=!0)),a&&(c[d++]=a);return d<c.length&&(c.length=d),1<d?c:c[0]}function parse_simple(a,b){if(is_string(b))a=a[b];else for(let c=0;a&&c<b.length;c++)a=a[b[c]];return a}function store_value(a,b,c,d,e){if(a=a[e],d===c.length-1)b[e]=a;else if(a)if(is_array(a)){b=b[e]=Array(a.length);for(let e=0;e<a.length;e++)store_value(a,b,c,d,e);}else b=b[e]||(b[e]=create_object()),e=c[++d],store_value(a,b,c,d,e);}function add_index(a,b,c,d,e,f,g,h){if(a=a[g],a)if(d===b.length-1){if(is_array(a)){if(c[d]){for(let b=0;b<a.length;b++)e.add(f,a[b],!0,!0);return}a=a.join(" ");}e.add(f,a,h,!0);}else if(is_array(a))for(let g=0;g<a.length;g++)add_index(a,b,c,d,e,f,g,h);else g=b[++d],add_index(a,b,c,d,e,f,g,h);}Document.prototype.add=function(a,b,c){if(is_object(a)&&(b=a,a=parse_simple(b,this.key)),b&&(a||0===a)){if(!c&&this.register[a])return this.update(a,b);for(let d,e,f=0;f<this.field.length;f++)e=this.field[f],d=this.tree[f],is_string(d)&&(d=[d]),add_index(b,d,this.marker,0,this.index[e],a,d[0],c);if(this.tag){let d=parse_simple(b,this.tag),e=create_object();is_string(d)&&(d=[d]);for(let b,f,g=0;g<d.length;g++)if(b=d[g],!e[b]&&(e[b]=1,f=this.tagindex[b]||(this.tagindex[b]=[]),(!c||!f.includes(a))&&(f[f.length]=a,this.fastupdate))){const b=this.register[a]||(this.register[a]=[]);b[b.length]=f;}}if(this.store&&(!c||!this.store[a])){let c;if(this.storetree){c=create_object();for(let a,d=0;d<this.storetree.length;d++)a=this.storetree[d],is_string(a)?c[a]=b[a]:store_value(b,c,a,0,a[0]);}this.store[a]=c||b;}}return this},Document.prototype.append=function(a,b){return this.add(a,b,!0)},Document.prototype.update=function(a,b){return this.remove(a).add(a,b)},Document.prototype.remove=function(a){if(is_object(a)&&(a=parse_simple(a,this.key)),this.register[a]){for(let b=0;b<this.field.length&&(this.index[this.field[b]].remove(a,!this.worker),!this.fastupdate);b++);if(this.tag&&!this.fastupdate)for(let b in this.tagindex){const c=this.tagindex[b],d=c.indexOf(a);-1!==d&&(1<c.length?c.splice(d,1):delete this.tagindex[b]);}this.store&&delete this.store[a],delete this.register[a];}return this},Document.prototype.search=function(a,b,c,d){c||(!b&&is_object(a)?(c=a,a=""):is_object(b)&&(c=b,b=0));let e,f,g,h,j,k,l=[],m=[],n=0;if(c)if(is_array(c))g=c,c=null;else {if(a=c.query||a,e=c.pluck,g=e||c.index||c.field,h=c.tag,f=this.store&&c.enrich,j="and"===c.bool,b=c.limit||b||100,k=c.offset||0,h&&(is_string(h)&&(h=[h]),!a)){for(let a,c=0;c<h.length;c++)a=get_tag.call(this,h[c],b,k,f),a&&(l[l.length]=a,n++);return n?l:[]}is_string(g)&&(g=[g]);}g||(g=this.field),j=j&&(1<g.length||h&&1<h.length);const o=!d&&(this.worker||this.async)&&[];for(let e,f,p,q=0;q<g.length;q++){let i;if(f=g[q],is_string(f)||(i=f,f=i.field,a=i.query||a,b=i.limit||b),o){o[q]=this.index[f].searchAsync(a,b,i||c);continue}else e=d?d[q]:this.index[f].search(a,b,i||c);if(p=e&&e.length,h&&p){const a=[];let c=0;j&&(a[0]=[e]);for(let b,d,e=0;e<h.length;e++)b=h[e],d=this.tagindex[b],p=d&&d.length,p&&(c++,a[a.length]=j?[d]:d);c&&(e=j?intersect(a,b||100,k||0):intersect_union(e,a),p=e.length);}if(p)m[n]=f,l[n++]=e;else if(j)return []}if(o){const d=this;return new Promise(function(e){Promise.all(o).then(function(f){e(d.search(a,b,c,f));});})}if(!n)return [];if(e&&(!f||!this.store))return l[0];for(let g,h=0;h<m.length;h++){if(g=l[h],g.length&&f&&(g=apply_enrich.call(this,g)),e)return g;l[h]={field:m[h],result:g};}return l};function get_tag(a,b,c,d){let e=this.tagindex[a],f=e&&e.length-c;if(f&&0<f)return (f>b||c)&&(e=e.slice(c,c+b)),d&&(e=apply_enrich.call(this,e)),{tag:a,result:e}}function apply_enrich(a){const b=Array(a.length);for(let c,d=0;d<a.length;d++)c=a[d],b[d]={id:c,doc:this.store[c]};return b}Document.prototype.contain=function(a){return !!this.register[a]},(Document.prototype.get=function(a){return this.store[a]},Document.prototype.set=function(a,b){return this.store[a]=b,this}),(Document.prototype.searchCache=searchCache),(Document.prototype.export=exportDocument,Document.prototype.import=importDocument),apply_async(Document.prototype);

class GeneralData {
    constructor(init) {
        this.items = [];
        this.meta = { totalResults: 0 };
        this.limit = 100;
        this.fetchRetries = 3;
        this.fetchDelay = 1000;
        Object.assign(this, init);
    }
    async fetchData() {
        this.items = [];
        return Promise.resolve({ items: this.items, meta: this.meta });
    }
    async fetchWithRetry(url, options = {}) {
        return this.retry(async () => {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response;
        });
    }
    async retry(fn, attempt = 1) {
        try {
            return await fn();
        }
        catch (error) {
            if (attempt < this.fetchRetries) {
                await new Promise(resolve => setTimeout(resolve, this.fetchDelay));
                return this.retry(fn, attempt + 1);
            }
            throw error;
        }
    }
}

class DataWrap extends s {
    constructor() {
        super(...arguments);
        this.auto = false;
    }
    fetchResults() {
        if (this.url) {
            const url = new URL(this.url);
            if (this.params)
                for (const [k, v] of Object.entries(this.params)) {
                    url.searchParams.set(k, v);
                }
            fetch(url.toString()).then(r => r.json()).then(d => { this.lastResponse = d; });
            if (this.poll)
                setTimeout(() => { this.fetchResults(); }, this.poll);
        }
    }
    updated(changedProperties) {
        if (this.auto) {
            if (changedProperties.has('auto') || changedProperties.has('url') || changedProperties.has('params') || changedProperties.has('poll'))
                this.fetchResults();
        }
        if (this.lastResponse)
            this.dispatchEvent(new Event('response', { bubbles: true, composed: true }));
    }
}
__decorate([
    e({ type: Boolean })
], DataWrap.prototype, "auto", void 0);
__decorate([
    e({ type: String })
], DataWrap.prototype, "url", void 0);
__decorate([
    e({ type: Object })
], DataWrap.prototype, "params", void 0);
__decorate([
    e({ type: Number, attribute: "debounce-duration" })
], DataWrap.prototype, "debounceDuration", void 0);
__decorate([
    e({ type: Number })
], DataWrap.prototype, "poll", void 0);
__decorate([
    e({ type: Object })
], DataWrap.prototype, "lastResponse", void 0);

class VirgoUtils {
    static async guestAuthToken() {
        const options = {
            method: "POST",
        };
        const data = await fetch(this.authURL, options).then((r) => r.text());
        if (data !== undefined) {
            return `Bearer ${data}`;
        }
        return "";
    }
    static async fetchData(searchURL, linkBaseURL, query, limit = 5) {
        const options = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": await VirgoUtils.guestAuthToken(),
            },
            body: JSON.stringify({
                query: `keyword: {${query === undefined ? "" : query}}`,
                pagination: {
                    start: 0,
                    rows: limit,
                },
                sort: {
                    sort_id: "SortRelevance",
                    order: "desc",
                },
                filters: [
                    {
                        pool_id: "uva_library",
                        facets: [],
                    },
                ],
            }),
        };
        try {
            const response = await fetch(searchURL, options);
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
            const data = await response.json();
            // console.log("API Response Data:", data); // Add this line to log the response data
            const results = VirgoUtils.parseResults(linkBaseURL, data);
            return results;
        }
        catch (error) {
            console.error(`Error in fetchData: ${error.message}`);
            return { items: [], meta: { totalResults: 0 } };
        }
    }
    static parseResults(linkBaseURL, { group_list = [], pagination = {} }) {
        const items = group_list.map((g) => {
            var _a, _b;
            if (g.count === 1) {
                const hit = g.record_list[0];
                const id = (_a = hit.fields.find((f) => f.type === "identifier")) === null || _a === void 0 ? void 0 : _a.value;
                const virgoLink = id ? `${linkBaseURL}/${id}` : undefined;
                const datePublishedField = hit.fields.find((f) => f.name === "published_date");
                const datePublished = datePublishedField
                    ? new Date(Date.UTC.apply(null, datePublishedField.value.split("-")))
                    : undefined;
                const authors = this.truncateAuthors(hit.fields.filter((f) => f.type === "author"));
                const item = {
                    id,
                    title: (_b = hit.fields.find((f) => f.type === "title")) === null || _b === void 0 ? void 0 : _b.value,
                    description: ``,
                    link: virgoLink,
                    author: authors,
                    datePublished,
                    publicationType: hit.fields.filter((f) => f.name === "pub_type").map((a) => a.value),
                    format: hit.fields.filter((f) => f.name === "format").map((a) => a.value),
                };
                return item;
            }
            return null;
        }).filter((item) => item !== null);
        const meta = {
            totalResults: pagination ? pagination.total : 0,
        };
        return { items, meta };
    }
    static truncateAuthors(authors) {
        let truncated = authors.map((a) => a.value);
        const maxLength = 5;
        if (truncated.length > maxLength) {
            const extraCount = truncated.length - maxLength;
            truncated = truncated.slice(0, maxLength).concat(`and ${extraCount} more`);
        }
        return truncated;
    }
}
VirgoUtils.authURL = "https://search.lib.virginia.edu/authorize";

class CatalogData extends GeneralData {
    constructor() {
        super(...arguments);
        this.items = [];
    }
    async fetchData(params) {
        var _a;
        const limit = (_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : this.limit;
        // ToDo: Just a note that using `limit+1` is a hack to accomodate a bug in the upstream Virgo API
        const results = await VirgoUtils.fetchData(CatalogData.virgoCatalogPoolURL, CatalogData.catalogLinkBase, this.query, limit + 1);
        results.meta.url = `https://search.lib.virginia.edu/?q=${this.query}&pool=uva_library`;
        this.items = results.items;
        this.meta = results.meta;
        return results;
    }
}
CatalogData.virgoCatalogPoolURL = "https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/search";
CatalogData.catalogLinkBase = "https://search.lib.virginia.edu/sources/uva_library/items";

class ArticlesData extends GeneralData {
    constructor() {
        super(...arguments);
        this.items = [];
    }
    async fetchData(params) {
        var _a;
        const limit = (_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : this.limit;
        const results = await VirgoUtils.fetchData(ArticlesData.articlePoolURL, ArticlesData.articleLinkBaseURL, this.query, limit);
        results.meta.url = `https://search.lib.virginia.edu/?q=keyword:+{${this.query}}&pool=articles`;
        this.items = results.items;
        this.meta = results.meta;
        return results;
    }
}
ArticlesData.articlePoolURL = "https://pool-eds-ws.internal.lib.virginia.edu/api/search";
ArticlesData.articleLinkBaseURL = "https://search.lib.virginia.edu/sources/articles/items";

export { ArticlesData as A, CatalogData as C, DataWrap as D, GeneralData as G, Document as a };
