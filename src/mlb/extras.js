const fs = require('fs');
const { markdownToTxt } = require('markdown-to-txt');

module.exports = async function() {
    let extras = [];
    const files = fs.readdirSync('src/mlb-extra')
    for (let i=0; i<files.length; i++) {
        const filename = files[i];
        // only worry about pre-transformed markdown files
        if (filename.match(/\.md$/)) {
            let contents = fs.readFileSync(`src/mlb-extra/${filename}`).toString().replace(/\r\n/gm,"\n");
            let extra = {
                id: filename.replace('.md',''),
                title: contents.match(/## (.*)/m)[1].trim(),
                plainText: markdownToTxt(contents.replace(/\-\-\-[^]*\-\-\-/m,'')).replace(/\s+/g, " ")
            };

            extras.push(extra);
        }      
    }
    return extras;
}