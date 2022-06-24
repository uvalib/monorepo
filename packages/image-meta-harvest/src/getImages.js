// use minimist for easy parsing of arguments from cli
const argv = require('minimist')(process.argv.slice(2));
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const gm = require('gm').subClass({imageMagick: true});
const im = require('imagemagick')
const { getFiles, alterFileName } = require('./shared.js');


// We're using the singleton here for convenience:
const exiftool = require("exiftool-vendored").exiftool;

// using sharp to convert to webp
const sharp = require('sharp');
const jo = require('jpeg-autorotate')

function GM(image,meta,outputPath) {
    return new Promise( function(resolve,reject) {
      try {
        console.log("convert with Imagemagick");
        console.log(outputPath); 
             
/*
        gm(image)
          .profile()
          .toBuffer('jpeg',function (err, buffer) {
            if (err) {
              console.log(err);
              writeFileSync(outputPath.replace('webp','error1'), "corrupt?");
              resolve();
            } else {
              console.log(`attempt to convert from jpg to webp with sharp`)
              sharp(buffer).withMetadata().rotate().webp().toFile(outputPath)
              .then(()=>{
                resolve();
              })
              .catch((err)=>{
                console.log(err);
                writeFileSync(outputPath.replace('webp','error2'), "corrupt?");
                resolve();
                //reject(err);
              }) 
            }                         
          })
*/          
//          //.autoOrient() // not working on cannon raw files!?!
//          .write(outputPath, function(err) {
//            if(err) {
//                console.log("couldn't convert with Imagemagick!!!!!!!")  
//                //assume that the file is corrupt and move along
//                writeFileSync(outputPath.replace('webp','error'), "corrupt?");
////                throw(err);
//            }
//
//            resolve();
//          });
      }
      catch (err) {
        reject(err);
      }
    });
  }  

async function doit(){
//    var log = JSON.parse( readFileSync('./import-meta.json') );
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
//                await GM(f.file, meta, dest);
//                console.log('*** converted image with gm ***');
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
//            log[f.id] = f;
//            writeFileSync('import-meta.json', JSON.stringify(log,null,2));
            console.log(`Write image ${f.id} to ${argv.out} in webp format`);
        }
    }
}

doit();