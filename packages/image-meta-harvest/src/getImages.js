// use minimist for easy parsing of arguments from cli
const argv = require('minimist')(process.argv.slice(2));
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const im = require('imagemagick')
const { getFiles, alterFileName } = require('./shared.js');


// We're using the singleton here for convenience:
const exiftool = require("exiftool-vendored").exiftool;

// using sharp to convert to webp
const sharp = require('sharp');
const jo = require('jpeg-autorotate')

async function doit(){
    var imagesSeen = [];

    console.log(`Get images from ${argv.in}`)
    for await(const f of getFiles(argv.in)) {
        const dest = alterFileName(`${argv.out}${f.id}.webp`);
        const destDir = alterFileName(dest.replace(/(.*)\/.*/,"$1"));
        console.log(`found ${f.name}`)
        if (!imagesSeen.includes(f.id) && f.mime.indexOf("image")>-1 && !await existsSync(dest) && !await existsSync(dest.replace('.webp','.error'))){
            console.log(`create directory path`)            
            if (!existsSync(destDir)) {
                mkdirSync(destDir, {recursive: true});
            }

            console.log(`Attempt to convert ${f.file}`)
            let convertError = null;
            const meta = await exiftool.read(f.file)
            writeFileSync(dest.replace('webp','meta.json'), JSON.stringify(meta))
            await sharp(f.file).withMetadata().rotate().webp().toFile(dest)
                .catch((err)=>{
                    console.log(err);
                    convertError = err;
                })
            if (convertError) {
              im.convert([f.file, dest], 
                function(err, stdout){
                  if (err) {
                    console.log("couldn't convert with Imagemagick!!!!!!!")  
                    //assume that the file is corrupt and move along
                    writeFileSync(dest.replace('webp','error'), "corrupt?");
                  }
                  console.log("converted with im ***");
                });  
            }
            f.copiedTo = dest;
            imagesSeen.push(f.id);
            console.log(`Write image ${f.id} to ${argv.out} in webp format`);
        }
    }
}

doit();