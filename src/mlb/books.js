const fs = require('fs');
const parserHelper = require('./parserHelper.js');

module.exports = async function() {
    let books = [];
    let files = fs.readdirSync('src/mlb/TransmogXML');

    let imagesDir = fs.readdirSync('src/mlb/images');

    let imagePaths = {};
    imagesDir.forEach(image => {
      let id = image.replace(/\-\w\.png/,'').replace(/\.png/,'');
      if (imagePaths[id]) imagePaths[id].push(image)
      else imagePaths[id] = [image]
    });


    files.forEach(file => {
        let contents = fs.readFileSync(`src/mlb/TransmogXML/${file}`);
        let jObj = parserHelper.parse(contents);
        jObj.ordered = parserHelper.parse(contents, true);
console.log(JSON.stringify(jObj.ordered,null,4));        
        
        jObj.TEI.BOOK.forEach(book=>{
            book.id = book.NUMBER;
            if (imagePaths[book.id]) book.images = imagePaths[book.id];
            book.yearId = file.replace('.xml','');
            books.push(book);
        });
        
    })
    
    return books;
}

// just for dev
module.exports().then(books=>console.log( JSON.stringify(books,null,2) ))