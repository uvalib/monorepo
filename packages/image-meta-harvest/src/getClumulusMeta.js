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

    }
}

doit();