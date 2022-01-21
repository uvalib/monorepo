const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser({
    alwaysCreateTextNode: true,
    isArray: (name, jpath, isLeafNode, isAttribute) => { 
        if (name === "span") return true; 
    }
});

exports.mkTextNodeReducer = function(spacer=''){ 
    return (p,c)=>{ 
        if (!p) p = {'#text':''};
        return {'#text':`${p['#text']}${spacer}${c['#text']}`}; 
    } 
}

const traverse = require('traverse');
exports.cleanup = function(obj){
    traverse(obj).forEach( function(x){
        // strip out spans by simply joining there text (without space)
        if (x.span) this.update( x.span.reduce( exports.mkTextNodeReducer()) );
    });
    // traverse a second time to join #text chunks left in arrays
    traverse(obj).forEach( function(x){
        if (Array.isArray(x) && x.length>0 && x[0]['#text']) {
            this.update( x.reduce( exports.mkTextNodeReducer(' ')) );
        }        
    } );
    return obj;
}

exports.parse = function(obj){
    return exports.cleanup(parser.parse(obj));
}