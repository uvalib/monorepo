const fs = require('fs');
const books = require('./books.js');

module.exports = async function() {
    let revisions = [];
    let bks = await books();

//    bks.forEach(b=>{
//        b.revisions.forEach(r=>{
//            r.year = b.year;
//            r.book = b.id;
//            r.bookTitle = b.title;
//            r.type = "revision";
//            revisions.push(r);
//        });
//    })

    return revisions;
}