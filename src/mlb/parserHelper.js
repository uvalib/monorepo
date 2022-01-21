const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser({
    alwaysCreateTextNode: true,
    isArray: (name, jpath, isLeafNode, isAttribute) => { 
        if (name === "span") return true; 
    }
});

const traverse = require('traverse');
exports.cleanup = function(obj){
    traverse(obj).forEach( function(x){
        // strip out spans by simply joining there text (without space)
        if (x.span) this.update( x.span.reduce((p,c)=>{ return {'#text':`${p['#text']}${c['#text']}`}; },{'#text':''}) );
    });
    return obj;
}

exports.parse = function(obj){
    return exports.cleanup(parser.parse(obj));
}