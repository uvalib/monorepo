const _ = require('lodash');

const fs = require('fs');
const config = require('./parseConfig.json');

const parseContent = (content)=>{
    let doc = {};
    config.forEach(docParse=>{
        let match;
        let matched = !docParse.matches.every(matcher=>{
            if (docParse.srcPath && doc[docParse.srcPath]) {
                match  = doc[docParse.srcPath].match( eval(matcher) );
            } else { 
                if (docParse.repeat) {
                    match = [...content.matchAll( eval(matcher) )];
                } else
                    match = content.match( eval(matcher) );
            }
            return (!match)  // return true to try again (if we don't have a match yet)
        })
        if (matched) {
            if (Number.isInteger(docParse.path)) {
                if (docParse.repeat) {
                    match.forEach(m=> doc[ _.camelCase(m[docParse.path]) ] = m[docParse.capture].trim() )
                } else
                    doc[ _.camelCase(match[docParse.path]) ] = match[docParse.capture].trim();
            } else if (Array.isArray(docParse.path)) {
                if (!doc[ docParse.path[0] ]) doc[ docParse.path[0] ]={};
                if (docParse.repeat) {
                    match.forEach(m=> {
                        doc[ docParse.path[0] ][ _.camelCase(m[docParse.path[1]]) ] = {}
                        doc[ docParse.path[0] ][ _.camelCase(m[docParse.path[1]]) ][docParse.path[2]] = m[docParse.capture].trim();
                    })
                }
            } else {
                doc[docParse.path] = match[docParse.capture].trim();
            }
            // whittle down the content to make parsing easier as we go
            if (docParse.leftover) { 
                content = match[docParse.leftover] 
            }
        }
    })
    config.forEach(docParse=>{
        if (docParse.excluded) delete doc[docParse.path];
    })
    return doc;    
}

module.exports = async function() {
    let years = [];
    const files = fs.readdirSync('src/mlb/yearDocs')
    for (let i=0; i<files.length; i++) {
        const filename = files[i];
        // only worry about pre-transformed markdown files
        if (filename.match(/\.md$/)) {
            let contents = fs.readFileSync(`src/mlb/yearDocs/${filename}`).toString();

            contents = contents.replace(/(torchbearer\s+)([A-Z][1-9]?)/g,"<uvalib-modal-image-button alt=' ' src='/mlb/images/torchbearers/$2.webp'>$1$2</uvalib-modal-image-button>");

            let year = parseContent( contents );

            // setup search index content field
            let content = "";
            Object.keys(year).forEach(k=>{
                if ( k!='full' && !k.match(/\d\d\d/) ) {
                    content += " "+year[k];
                }
            });
            year.id = year.year;
            year.searchContent = content;

            years.push( year ); 
        }      
    }
    return years;
}