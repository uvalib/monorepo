const _ = require('lodash');

const fs = require('fs');
const years = require('./years.js');

module.exports = async function() {
    let books = [];
    let yrs = await years();

    yrs.forEach(y=>{
        
        Object.keys(y.books).forEach(bid=>{
            y.books[bid].id = bid;
            y.books[bid].year = y.year;          
            y.books[bid].label = y.books[bid].full.match( /^([^]+?)\n\n/m )[1].replace(/[\*\n]/g," ").replace(/<[^>]*>?/gm, '').trim();

            let line = y.books[bid].label;

console.log(bid);
console.log(line);
            
        // Extract 'other' and remove it from line
        const otherMatch = line.match(/\(([^)]+)\)$/);
        const other = otherMatch ? otherMatch[1] : '';
        line = line.replace(otherMatch ? ` (${otherMatch[1]})` : '', '');

        // Extract 'date' and remove it from line
        // Adjusted to handle all date variations including "1926–1969; 1978– ."
        const dateMatch = line.match(/(\d{4}(–\d{4})*(\s*;\s*\d{4}(–\d{4})*\s*)*–*\.*\s*\.*)$/);
        const date = dateMatch ? dateMatch[1].trim() : '';
        line = line.replace(dateMatch ? ` ${dateMatch[1]}` : '', '');

        // Remaining part of line is 'author. title'
        // Split by '. ' (dot followed by space) only when it's the first occurrence followed by two or more Unicode letters (not single letter and not followed by period or space)
        // The 'u' flag is used to enable full Unicode matching
        const authorTitleMatch = line.match(/(.*?(?<=\b\p{L}{2,}))(\. )(.*)/u);
        const author = authorTitleMatch ? authorTitleMatch[1].trim() : '';
        const title = authorTitleMatch ? authorTitleMatch[3].trim() : '';

            y.books[bid].author = author;
            y.books[bid].title = title;
            y.books[bid].date = date;
            y.books[bid].something = other;
            //return { author, title: title.trim(), date: date.trim(), other: other.slice(1, -1).trim() };
            //y.books[bid].author = y.books[bid].label.replace( /(.+)\..+\..+\..+/, '$1');
            //y.books[bid].title = y.books[bid].label.replace( /.+\.(.+)\..+\..+/, '$1');
            //y.books[bid].date = y.books[bid].label.replace( /.+\..+\.(.+)\..+/, '$1');
            //y.books[bid].something = y.books[bid].label.replace( /.+\..+\..+\.(.+)/, '$1');

            let revisions = []
            const revMatches = [...y.books[bid].full.matchAll(/^####\s+([1-9a-z]+)\.\s+(.+)$([^]+?)(?=^####|$(?!\n))/mg)];
            revMatches.forEach(m=>{
                revisions.push({
                    id: m[1],
                    title: m[2],
                    full: m[3]
                })
            });
            y.books[bid].revisions = revisions;
            y.books[bid].type = "book";
        
            books.push(y.books[bid]);
        })

    })
    
    return books;
}

//module.exports().then(books=>console.log( JSON.stringify( books, null, 2) ))
