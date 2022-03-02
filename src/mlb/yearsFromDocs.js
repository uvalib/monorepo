const textract = require('textract');
const fs = require('fs');
const { getTextFromZipFile } = require('textract/lib/util');
const config = require('./parseConfig.json');

// Wrap textract to provide promise
const readFromDoc = (filename) => {
    return new Promise((resolve, reject) => {
        textract.fromFileWithPath(filename, {preserveLineBreaks:true}, (err, text)=>{
            if (err) return reject(err);
            resolve(text);
        });
    });
}

const parseContent = (content)=>{
    let doc = {};
    config.forEach(docParse=>{
        let match;
        let matched = !docParse.matches.every(matcher=>{
            if (docParse.srcPath && doc[docParse.srcPath]) {
                console.log( docParse.srcPath )
                console.log( doc[docParse.srcPath] )
                console.log( matcher )
                match  = doc[docParse.srcPath].match( eval(matcher) );
                console.log( match )
            } else { 
                match = content.match( eval(matcher) );
            }
            return (!match)  // return true to try again (if we don't have a match yet)
        })
        if (matched) {
            doc[docParse.path] = match[docParse.capture].trim();
            // whittle down the content to make parsing easier as we go
            if (docParse.leftover) { 
                content = match[docParse.leftover] 
            }
        }
    })
    return doc;    
}

module.exports = async function() {
    let years = [];
    const files = fs.readdirSync('src/mlb/yearDocs')
    for (let i=0; i<files.length; i++) {
        const filename = files[i];
        let contents = await readFromDoc(`src/mlb/yearDocs/${filename}`);
        years.push( parseContent(contents) );       
    }
    return years;
}

//module.exports().then(years=>console.log( JSON.stringify(years, null, 2) ))