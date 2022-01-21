const fs = require('fs');
const parserHelper = require('./parserHelper.js');

module.exports = async function() {
    let books = [];
    let files = fs.readdirSync('src/mlb/TransmogXML')
    files.forEach(file => {
        let contents = fs.readFileSync(`src/mlb/TransmogXML/${file}`);
        let jObj = parserHelper.parse(contents);
        jObj.TEI.BOOK.forEach(book=>{
            book.id = book.NUMBER;
            book.yearId = file.replace('.xml','');
            books.push(book);
        });
    })
    return books;
}

// just for dev
module.exports().then(books=>console.log( JSON.stringify(books,null,2) ))