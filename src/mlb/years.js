const fs = require('fs');
const parserHelper = require('./parserHelper.js');
const traverse = require('traverse');


const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser({
    alwaysCreateTextNode: true,
    isArray: (name, jpath, isLeafNode, isAttribute) => { 
        if (name === "span") return true; 
    }
});

module.exports = async function() {
    let years = [];
    let files = fs.readdirSync('src/mlb/TransmogXML')
    files.forEach(file => {
        let contents = fs.readFileSync(`src/mlb/TransmogXML/${file}`);
        let jObj = parser.parse(contents);
        let name = file.replace(".xml","");
        jObj.filename = name;
        years.push( parserHelper.cleanup(jObj) );
    })
    return years;
}

module.exports().then(years=>console.log( JSON.stringify(years[15], null, 2) ))