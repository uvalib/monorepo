const argv = require('minimist')(process.argv.slice(2));

const { walkImageFiles } = require('./shared.js');
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');

const {v3: uuidv3} = require('uuid');

async function doit(){
    console.log(`looking for images to convert in ${argv.in}`)
    await walkImageFiles(argv.in, (file)=>{
        const pathId = file.replace('.webp','');
        console.log(`Looking at object ${pathId}`)
        let meta = JSON.parse(readFileSync(pathId+'.meta.json'));
        console.log(`Source file was: ${meta.SourceFile}`)
        const uuid = uuidv3(pathId, argv.rootUUID)
        console.log(`Objects uuid is: ${uuid}`)
        meta.UUID = uuid;
        writeFileSync(pathId+'.meta.json', JSON.stringify(meta));
        console.log('wrote uuid to meta file!')
    });
}

doit();