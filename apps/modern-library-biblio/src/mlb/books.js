const _ = require('lodash');

const fs = require('fs');
const years = require('./years.js');

function parseLabel(label) {
    // Split the label into parts
    const parts = label.split('.').map(part => part.trim());
    
    let author = '';
    let title = '';
    let date = '';
    let something = '';
    let authorLastFirst = '';
    
    // Handling different number of parts
    switch (parts.length) {
        case 4: // author, title, date, something
            author = parts[0];
            title = parts[1];
            date = parts[2];
            something = parts[3].replace(/[\(\)]/g, ''); // remove parentheses
            
            // Process authorLastFirst
            const cleanedAuthor = author.replace(/&#46;/g, '.');
            const nameParts = cleanedAuthor.split(' ');
            if (nameParts.length > 1) {
                const lastName = nameParts.pop();
                const firstAndMiddle = nameParts.join(' ');
                authorLastFirst = `${lastName}, ${firstAndMiddle}`;
            } else {
                authorLastFirst = cleanedAuthor;
            }
            break;
            
        case 3: // title, date, something
            title = parts[0];
            date = parts[1];
            something = parts[2].replace(/[\(\)]/g, ''); // remove parentheses
            break;
            
        // handle other cases if necessary
    }
    
    return {
        author,
        title,
        date,
        something,
        authorLastFirst
    };
}

module.exports = async function() {
    let books = [];
    let yrs = await years();

    yrs.forEach(y=>{
        
        Object.keys(y.books).forEach(bid=>{
            y.books[bid].id = bid;
            y.books[bid].year = y.year;
            y.books[bid].label = y.books[bid].full.match( /^([^]+?)\n\n/m )[1].replace(/[\*\n]/g," ").replace(/<[^>]*>?/gm, '').trim();
            const parsedData = parseLabel(y.books[bid].label); 
y.books[bid].author = parsedData.author;
y.books[bid].title = parsedData.title;
y.books[bid].date = parsedData.date;
y.books[bid].something = parsedData.something;
y.books[bid].authorLastFirst = parsedData.authorLastFirst;


                     
//            y.books[bid].author = y.books[bid].label.replace( /(.+)\..+\..+\..+/, '$1');
//            y.books[bid].title = y.books[bid].label.replace( /.+\.(.+)\..+\..+/, '$1');
//            y.books[bid].date = y.books[bid].label.replace( /.+\..+\.(.+)\..+/, '$1');
//            y.books[bid].something = y.books[bid].label.replace( /.+\..+\..+\.(.+)/, '$1');

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