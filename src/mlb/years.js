const _ = require('lodash');

const fs = require('fs');
const config = require('./parseConfig.json');

module.exports = async function() {
    let years = [];
    const files = fs.readdirSync('src/mlb/yearDocs')
    for (let i=0; i<files.length; i++) {
        const filename = files[i];
        // only worry about pre-transformed markdown files
        if (filename.match(/\.md$/)) {
            let contents = fs.readFileSync(`src/mlb/yearDocs/${filename}`).toString().replace(/\r\n/gm,"\n");

//            contents = contents.replace(/(torchbearer\s+)([A-Z][1-9]?)/g,"<uvalib-modal-image-button alt=' ' src='/mlb/images/torchbearers/$2.webp'>$1$2</uvalib-modal-image-button>");

            let year = {}
            // store the full year content
            year.full = contents.match(/^([^]+)$/m)[1].trim();
            // store the year title/heading
            let match = contents.match(/^# (Modern Library Series\s+\d\d\d\d)\s*(\n[^]*)/im);
            year.title = match[1].trim();
            contents = match[2];            
            // grab the year from the title
            year.year = year.title.match(/(\d\d\d\d)/)[1].trim();
            // grab the sections from the text
            match = [...contents.matchAll( /^###\s+(.*)$([^]+?)(?=###\s+\w+)/gim )];
            match.forEach(m=> year[ _.camelCase(m[1]) ] = m[2].trim() )
            // grab the first para from the general section
            if (year.general) {
                if (year.general.match(/\n/m))
                    year.generalFirst = year.general.match(/([^]+?)(?=\n\n)/m)[1].trim();
                else year.generalFirst = year.general;
            }
            // grab the books
            match = [...contents.matchAll( /^###\s+(\d+)\s*$([^]+?)(?=^###\s+\w+|$(?!\n))/gm )];
            if (match && match.length>0) {
                year.books = {};
                match.forEach(m=> year.books[ _.camelCase(m[1]) ]={full: m[2]});
            }

//console.log(JSON.stringify(year))
            
            // setup search index content field
            let content = "";
            Object.keys(year).forEach(k=>{
                if ( k!='full' && !k.match(/\d\d\d/) ) {
                    content += " "+year[k];
                }
            });
            year.id = year.year;
            year.searchContent = content;
            year.type = "year";

            years.push( year ); 
        }      
    }
    return years;
}