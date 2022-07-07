const { walkImageFiles, asyncImConvert, createDateFromMeta } = require('./shared.js');
const argv = require('minimist')(process.argv.slice(2));
const { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, copyFileSync } = require('fs');

async function getImages(file) {
    console.log(file)
    const path = file.replace(/^(.*)\..+$/, "$1")
    if (!existsSync(path+".duplicate.json" && existsSync(path+".jp2") )) {
        let meta = JSON.parse(readFileSync(path+".meta.json"))
        const createDate = createDateFromMeta(meta)
        const dirPath = `${createDate.year}/${createDate.month}/${createDate.day}/`;
        if (!existsSync(argv.out+dirPath)) {
                mkdirSync(argv.out+dirPath, {recursive: true});
        }
        const toFile = argv.out+dirPath+meta.UUID+".jp2"
        meta.jp2Path = toFile;
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
        writeFileSync(path+".meta.json", JSON.stringify(meta))
    }
}

async function doit(){
    await walkImageFiles(argv.in, getImages);
}

doit();