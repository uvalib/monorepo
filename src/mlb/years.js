const fs = require('fs');
const parserHelper = require('./parserHelper.js');

module.exports = async function() {
    let years = [];
    let files = fs.readdirSync('src/mlb/TransmogXML')
    files.forEach(file => {
        let contents = fs.readFileSync(`src/mlb/TransmogXML/${file}`);
        let jObj = parserHelper.parse(contents);
        let name = file.replace(".xml","");
        jObj.filename = name;
        years.push( jObj );
    })
    return years;
}

module.exports().then(years=>console.log( JSON.stringify(years[15], null, 2) ))