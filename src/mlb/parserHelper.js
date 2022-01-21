const traverse = require('traverse');
exports.cleanup = function(obj){
    traverse(obj).forEach( function(x){
        // strip out spans by simply joining there text (without space)
        if (x.span) this.update( x.span.reduce((p,c)=>{ return {'#text':`${p['#text']}${c['#text']}`}; },{'#text':''}) );
    });
    return obj;
}