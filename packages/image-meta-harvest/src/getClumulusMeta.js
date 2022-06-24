// use minimist for easy parsing of arguments from cli
const argv = require('minimist')(process.argv.slice(2));

const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { getFiles, alterFileName } = require('./shared.js');

const FileSet = require('file-set');

const {parse} = require('csv-parse/sync'); 

async function doit(){

    // load csv
    console.log(`Get csv from ${argv.csvin}`)
    const csvstring = readFileSync(argv.csvin);
    const metaRecords = parse(csvstring, {
        columns: true,
        skip_empty_lines: true
      });
    console.log(metaRecords.length)
    console.log(metaRecords[0])

    console.log(`Get images from ${argv.in}`)
    for await(const f of getFiles(argv.in)) {
        if (f.file.indexOf("_faces")<0 && f.file.indexOf(".webp")>0) {
            const id = f.id.replace(/.+\/(.+)/,"$1")
            console.log(id)
            const meta = metaRecords.find(m=>alterFileName(m['Asset Name'].replace(/\..+/,''))===id)
            console.log(meta)
            if (meta) {
                writeFileSync(f.id+".curatedMeta.json", JSON.stringify(meta) )
                console.log(`wrote meta to ${f.id}.curatedMeta.json`)
            }
        }
//        if (f.file.indexOf("_faces")>-1 || f.file.indexOf(".webp")<0) break;
//        const id = f.id.replace(/^.+\/(.+)$/,"$1")
//        console.log(id)
//        const meta = metaRecords.find(m=>m['Asset Name'].replace(/\..+/,'')===id)
//        console.log(meta)
        
//        const dest = alterFileName(`${argv.out}${f.id}.webp`);
//        const destDir = alterFileName(dest.replace(/(.*)\/.*/,"$1"));
//        console.log(`found ${f.name}`)
//        if (!imagesSeen.includes(f.id) && f.mime.indexOf("image")>-1 && !await existsSync(dest) && !await existsSync(dest.replace('.webp','.error'))){
//            console.log(`create directory path`)            
//            if (!existsSync(destDir)) {
//                mkdirSync(destDir, {recursive: true});
//            }
//
//            console.log(`Attempt to convert ${f.file}`)
//            let convertError = null;
//            const meta = await exiftool.read(f.file)
//            writeFileSync(dest.replace('webp','meta.json'), JSON.stringify(meta))
//            await sharp(f.file).withMetadata().rotate().webp().toFile(dest)
//                .catch((err)=>{
//                    console.log(err);
//                    convertError = err;
//                })
//            if (convertError) {
//
//              im.convert([f.file, dest], 
//                function(err, stdout){
//                  if (err) {
//                    console.log("couldn't convert with Imagemagick!!!!!!!")  
//                    //assume that the file is corrupt and move along
//                    writeFileSync(dest.replace('webp','error'), "corrupt?");
//                  }
//                  console.log("converted with im ***");
//                });  
//            }
//            f.copiedTo = dest;
//            imagesSeen.push(f.id);
//
//            console.log(`Write image ${f.id} to ${argv.out} in webp format`);
//        }
    }
}

doit();