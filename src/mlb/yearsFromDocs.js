const textract = require('textract');
const fs = require('fs');
const { getTextFromZipFile } = require('textract/lib/util');

// Wrap textract to provide promise
const readFromDoc = (filename) => {
    return new Promise((resolve, reject) => {
        textract.fromFileWithPath(filename, {preserveLineBreaks:true}, (err, text)=>{
            if (err) return reject(err);
            resolve(text);
        });
    });
}

// This method returns the file title.
const getTitle = (content) => {
    let match = content.match(/\s*MODERN LIBRARY( SERIES)\s+\d\d\d\d?.*/gim) ||
//                content.match(/\s*Modern Library Series\s+\d\d\d\d.*/gm) ||
                content.match(/\s*Modern Library\s+\d\d\d\d.*/gim) //||
//                content.match(/\s*MODERN LIBRARY\s*\d\d\d\d/gm)
    return match? match[0]:"none found";
}

// This method returns the date heading.
const getHeadDate = (content) => {
    let match = content.match(/(Fall )?\d\d\d\d/gm)
    return match? match[0]:"none found";
}

// This method returns the season heading
const getHeadSeason = (content) => {
    let match = content.match(/\s*(Spring)|(Fall)\s*/gim)
    return match? match[0]:"none found"
}

module.exports = async function() {
    let years = [];
    const files = fs.readdirSync('src/mlb/yearDocs')
    for (let i=0; i<files.length; i++) {    
        const filename = files[i];
        const contents = await readFromDoc(`src/mlb/yearDocs/${filename}`);
        contents.match(/^MODERN LIBRARY SERIES.*/gm)
        years.push( {
            file: filename, 
//            content: contents,
            title: getTitle(contents).trim(),
            head: {
                date: getHeadDate(contents).trim(),
                season: getHeadSeason(contents).trim()
            }
        } );
    }
    return years;
}

module.exports().then(years=>console.log( "foo"))  //JSON.stringify(years, null, 2) ))