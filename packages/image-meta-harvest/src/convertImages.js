const argv = require('minimist')(process.argv.slice(2));

const { walkImageFiles, asyncImConvert } = require('./shared.js');
const { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, copyFileSync } = require('fs');


async function getObjects(img) {
    if (img.indexOf('webp')>0) {
        console.log(img);
        dest = img.replace('.webp','.'+argv.toext)
        console.log(dest)
        if (!existsSync(dest)) {
            await asyncImConvert([img, dest])
                .then(()=>console.log("converted with im ***"));
        }
    }
}

async function doit(){
    console.log(`looking for images to convert in ${argv.in}`)
    await walkImageFiles(argv.in, getObjects);
}

doit();