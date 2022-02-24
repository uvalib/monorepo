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

const getTitle = (content) => {
    let match = content.match(/^MODERN LIBRARY SERIES.*/gm);
    return match? match[0]:"";
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
            title: getTitle(contents)
        } );
    }
    return years;
}

module.exports().then(years=>console.log( "foo"))  //JSON.stringify(years, null, 2) ))