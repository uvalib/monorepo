const fs = require('fs');
const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser();

module.exports = async function() {
    let books = [];
    let files = fs.readdirSync('src/mlb/TransmogXML')
    files.forEach(file => {
        let contents = fs.readFileSync(`src/mlb/TransmogXML/${file}`);
        let jObj = parser.parse(contents);
        jObj.TEI.BOOK.forEach(book=>{
            book.yearId = file.replace('.xml','');
            books.push(book);
        });
    })
    return books;
}

//module.exports().then(books=>console.log(books[0]))