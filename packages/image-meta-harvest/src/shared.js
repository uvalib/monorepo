const { readdir, stat } = require('fs').promises;
const { image } = require('@tensorflow/tfjs-core');
const { resolve } = require('path');
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const sharp = require('sharp');
const jo = require('jpeg-autorotate')

// use mmmagic to get the mimetypes of files to find images
const mmm = require('mmmagic'),
      Magic = mmm.Magic,
      magic = new Magic(mmm.MAGIC_MIME_TYPE),
      magicDetect = (file)=>new Promise(resolve => magic.detectFile(file, (err,res)=>resolve(res)));

let imageExtensions = {};

// Figure out the type of the file
const getMimeType = async function getMimeType(dir, dirents) {
    for (var dirent of dirents) {
      if (!dirent.isDirectory()) {
          dirent.file = resolve(dir, dirent.name);
          dirent.id = dirent.file.replace(/^(.+)\..+$/,'$1');
          dirent.stats = await stat(dirent.file);
          dirent.extension = dirent.file.replace(/^.+\.(.+)$/,"$1");
          if (dirent.extension && imageExtensions[dirent.extension]) {
            dirent.mime = imageExtensions[dirent.extension];
          } else {
            dirent.mime = await magicDetect(dirent.file);
            if (dirent.extension && dirent.mime) {
                imageExtensions[dirent.extension] = dirent.mime;
            }
          }
      } else {
          dirent.stats = {size:0}
      }
    }
    return dirents
  }



// Assume that files with the same name but a different extension in a directory are the same image 
// Also assume that the larger image is higher res and/or bigger and filter out the smaller versions of the image
const filesSizeSorted = async function(dir, dirents) {
    dirents = dirents.filter(f=>f.name[0]!='.');
    dirents = await getMimeType(dir, dirents);
    // sort by size
    dirents.sort((a,b)=> b.stats.size - a.stats.size );
    return dirents;
}

// just a helper to find all the files in a dir      
const getFiles = async function*(dir) {
    let dirents = await filesSizeSorted( dir, await readdir(dir, { withFileTypes: true }) );
    for (const dirent of dirents) {        
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(res);
        } else {
            yield dirent;
        }
    }
}
exports.getFiles = getFiles;

const walkImageFiles = async function(dir, callable, metaExten='') {
    console.log(`Get images from ${dir}`)
    for await(const f of getFiles(dir)) {
        console.log(`looking at the mime type of ${f}`)
        if (f.mime.indexOf("image")>-1 && f.file.indexOf('_faces')<0 ) {
            const metaFile = f.file.replace('.webp', metaExten);
            if ( metaExtn!='' && !await existsSync(metaFile) ) {
                await callable(f.file, metaFile);
            } else {
                await callable(f.file);
            }
        }
    }
}
exports.walkImageFiles = walkImageFiles;

const getImageBuffer = async function(imgpath, tmpFile ) {
    let imageBuffer = await sharp(imgpath).withMetadata().jpeg().toBuffer();  //.toFile(tmpFile);
    await jo.rotate(imageBuffer)
        .then(({buffer, orientation, dimensions, quality})=>{
            console.log("Image has been rotated!");
            imageBuffer = buffer;
        })
        .catch((e)=>{
            if (e.code==jo.errors.correct_orientation) {
                console.log("Image didn't need to be rotated!");
                imageBuffer = readFileSync(tmpFile);
            } else {
                throw(e);
            }
        });
    return imageBuffer;
}
exports.getImageBuffer = getImageBuffer;