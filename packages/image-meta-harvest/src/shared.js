const { readdir, stat } = require('fs').promises;
const { image } = require('@tensorflow/tfjs-core');
const { resolve } = require('path');
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const sharp = require('sharp');
const jo = require('jpeg-autorotate');
const im = require('imagemagick');

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

const rawExts = ['.rw2','.raf','.cr2','.nrw','.erf','.nef','.arw','.rwz','.eip','.dng','.bay','.dcr','.raw','.crw','.3fr','.k25','.kc2','.mef','.dng','.cs1','.orf','.ari','.mos','.sr2','.srf','.cr3','.gpr','.mfw','.fff','.srw','.kdc','.mrw','.j6i','.rwl','.x3f','.pef','.iiq','.cxi','.nksc','.mdc']
exports.rawExts = rawExts;

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
//        console.log(`looking at the mime type of ${f.file}`)
        if (f.mime.indexOf("image")>-1 && f.file.indexOf('_faces')<0 ) {
            const metaFile = f.file.replace('.webp', metaExten);
            if ( !existsSync(metaFile) ) {
                await callable(f.file, metaFile);
            } 
        }
    }
}
exports.walkImageFiles = walkImageFiles;

const getImageBuffer = async function(imgpath, tmpFile ) {
    await sharp(imgpath).withMetadata().jpeg().toFile(tmpFile);
    await jo.rotate(tmpFile)
        .then(({buffer, orientation, dimensions, quality})=>{
            console.log("Image has been rotated!");
            imageBuffer = buffer;
        })
        .catch((e)=>{
            if (e.code==jo.errors.correct_orientation) {
                console.log("Image didn't need to be rotated!");
                imageBuffer = readFileSync(tmpFile);
            } else if (e.code ==jo.errors.read_exif) {            
                console.log("Couldn't read exif data from image");
                imageBuffer = readFileSync(tmpFile);
            } else {
                throw(e);
            }
        });
    return imageBuffer;
}
exports.getImageBuffer = getImageBuffer;

const alterFileName = function(data){
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
  exports.alterFileName = alterFileName;

  asyncImConvert = (paths)=>new Promise( (resolve,reject) => im.convert(paths, (err,stdout)=>{
    if (err) {
        console.log("couldn't convert with Imagemagick!!!!!!!")  
        //assume that the file is corrupt and move along
        writeFileSync(dest.replace(argv.toext,'converterror'), "corrupt?");
        reject(err);
    }
    resolve(stdout);
}));
exports.asyncImConvert = asyncImConvert;