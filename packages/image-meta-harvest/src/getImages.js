// use minimist for easy parsing of arguments from cli
const argv = require('minimist')(process.argv.slice(2));
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const gm = require('gm').subClass({imageMagick: true});
const { getFiles } = require('./shared.js');


// We're using the singleton here for convenience:
const exiftool = require("exiftool-vendored").exiftool;

// using sharp to convert to webp
const sharp = require('sharp');

function GM(image,meta,outputPath) {
    return new Promise( function(resolve,reject) {
      try {
        console.log("convert with Imagemagick");
        console.log(outputPath);
        gm(image)
          .autoOrient()
          .write(outputPath, function(err) {
            if(err) {
                console.log("couldn't convert with Imagemagick!!!!!!!")  
                //assume that the file is corrupt and move along
                writeFileSync(outputPath.replace('webp','error'), "corrupt?");
//                throw(err);
            }

            resolve();
          });
      }
      catch (err) {
        reject(err);
      }
    });
  }

function alterFileName(data){
  return data.replace(/[\:\*\?\"\<\>\|]/g, function (m) {
        return {
            ':': '',
            '*': '',
            '?': '',
            '"': '',
            '<': '',
            '>': '',
            '|': ''
        }[m];
    }).trim().replace(/\s*\/\s*/g,'/').replace(/\s\s+/g,' ');
}    

async function doit(){
    var log = JSON.parse( readFileSync('./import-meta.json') );
    var imagesSeen = [];

    console.log(`Get images from ${argv.in}`)
    for await(const f of getFiles(argv.in)) {
        const dest = alterFileName(`${argv.out}${f.id}.webp`);
        const destDir = alterFileName(dest.replace(/(.*)\/.*/,"$1"));
        if (!imagesSeen.includes(f.id) && f.mime.indexOf("image")>-1 && !await existsSync(dest) && !await existsSync(dest.replace('.webp','.error'))){
            
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
                console.log('*** converted image with gm ***');

                await GM(f.file, meta, dest);
            }
            f.copiedTo = dest;
            imagesSeen.push(f.id);
            log[f.id] = f;
            writeFileSync('import-meta.json', JSON.stringify(log,null,2));
            console.log(`Write image ${f.id} to ${argv.out} in webp format`);
        }
    }
}

doit();