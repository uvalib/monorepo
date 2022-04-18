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
            y.books[bid].author = y.books[bid].label.replace( /(.+)\..+\..+\..+/, '$1');
            y.books[bid].title = y.books[bid].label.replace( /.+\.(.+)\..+\..+/, '$1');
            y.books[bid].date = y.books[bid].label.replace( /.+\..+\.(.+)\..+/, '$1');
            y.books[bid].something = y.books[bid].label.replace( /.+\..+\..+\.(.+)/, '$1');

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
