const fs = require('fs');
const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser();

module.exports = async function() {
    let years = {};
    let files = fs.readdirSync('src/mlb/TransmogXML')
    files.forEach(file => {
        let contents = fs.readFileSync(`src/mlb/TransmogXML/${file}`);
        let jObj = parser.parse(contents);
        let name = file.replace(".xml","");
        years[name] = jObj;
    })
    return years;
}

//module.exports().then(years=>console.log(years))