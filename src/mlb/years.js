const fs = require('fs');
const traverse = require('traverse');
const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser({
    alwaysCreateTextNode: true,
    isArray: (name, jpath, isLeafNode, isAttribute) => { 
        if (name === "span") return true; 
    }
});

const cleanup = function(obj){
    traverse(obj).forEach( function(x){
        if (x.span) this.update( x.span.reduce((p,c)=>{ return {'#text':`${p['#text']}${c['#text']}`}; },{'#text':''}) );
    });
    return obj;
}

module.exports = async function() {
    let years = [];
    let files = fs.readdirSync('src/mlb/TransmogXML')
    files.forEach(file => {
        let contents = fs.readFileSync(`src/mlb/TransmogXML/${file}`);
        let jObj = parser.parse(contents);
        let name = file.replace(".xml","");
        jObj.filename = name;
        years.push( cleanup(jObj) );
    })
    return years;
}

module.exports().then(years=>console.log( JSON.stringify(years[15], null, 2) ))