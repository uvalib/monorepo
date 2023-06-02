const fs = require('fs');

module.exports = async function() {
    let covers = [];
    const files = fs.readdirSync('src/mlb/images/covers')
    for (let i=0; i<files.length; i++) {
        const filename = files[i];
        // only worry about webp files
        if (filename.match(/\.webp$/)) {
            let c = {filename: '/mlb/images/covers/'+filename};
            const match = filename.match(/ML_(\d\d\d\d)_(\d\d\d[a-z])[\._]/i)
            if (match) {
                c.year = match[1];
                c.revision = match[2]
            }
            const match2 = filename.match(/ML_(\d\d\d\d)_(\d\d\d)/i)
            if (match2) {
                c.year = match2[1];
                c.book = match2[2]
            }
            covers.push(c); 
        }      
    }
    return covers;
}