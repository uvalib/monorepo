const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser();
const fs = require('fs');
let content = fs.readFileSync("src/mlb/TransmogXML/1926_rev.xml");
let jObj = parser.parse(content);
console.log(jObj.TEI.BOOK)