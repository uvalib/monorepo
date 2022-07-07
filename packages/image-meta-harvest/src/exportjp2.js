const { walkImageFiles, asyncImConvert } = require('./shared.js');
const argv = require('minimist')(process.argv.slice(2));
const { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, copyFileSync } = require('fs');

async function getImages(file) {
    console.log(file)
    const path = file.replace(/^(.*)\..+$/, "$1")
    if (!existsSync(path+".duplicate.json" && existsSync(path+".jp2") )) {
        const meta = JSON.parse(readFileSync(path+".meta.json"))
        const toFile = argv.out+meta.UUID+".jp2"
        if (!existsSync(toFile)) {
            if (!existsSync(path+".jp2")) {
                await asyncImConvert([file, path+".jp2"])
                    .then(()=>console.log(`converted with im *** \n${path+".jp2"}`));
            }
            if (existsSync(path+".jp2")) {
                copyFileSync(path+".jp2", toFile)
                console.log(`copied image to ${toFile}`)
            }
        }
    }
}

async function doit(){
    await walkImageFiles(argv.in, getImages);
}

doit();