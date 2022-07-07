const {parse} = require('csv-parse/sync');
const { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } = require('fs');
const { rawExts } = require('./shared.js');


const writeOut = function(from, to ,ext) {
    let fromList = []
    const path = from+"."+ext+".json"
    if ( existsSync(path) ) {
        fromList = JSON.parse(readFileSync(path))
    }
    if (!fromList.includes(to)) { 
        fromList.push(to) 
        writeFileSync(path, JSON.stringify(fromList))
        console.log(`wrote to file ${path}`)
    }
}
const processDup = function(rec) {
    // go with non raw
    if (rawExts.includes(rec.fromExt) && !rawExts.includes(rec.toExt)) {
        writeOut(rec.fromPath, rec.toPath, "duplicate")
        writeOut(rec.toPath, rec.fromPath, "duplicatesOf")
    }
    else if (!rawExts.includes(rec.fromExt) && rawExts.includes(rec.toExt)) {
        writeOut(rec.toPath, rec.fromPath, "duplicate")
        writeOut(rec.fromPath, rec.toPath, "duplicatesOf")
    }
    else {
        // or go with the largest file
        fromstats = statSync(rec.dup.from);
        tostats = statSync(rec.dup.to)
        if (fromstats.size > tostats.size) {
            writeOut(rec.toPath, rec.fromPath, "duplicate")
            writeOut(rec.fromPath, rec.toPath, "duplicatesOf")
        }
        else {
            writeOut(rec.fromPath, rec.toPath, "duplicate")
            writeOut(rec.toPath, rec.fromPath, "duplicatesOf")
        }
    }
}
const processClose = function(rec) {
    writeOut(rec.fromPath, rec.toPath, "veryclose");
    writeOut(rec.toPath, rec.fromPath, "veryclose");
    processSimilar(rec);
}
const processSimilar = function(rec) {
    writeOut(rec.fromPath, rec.toPath, "similar");
    writeOut(rec.toPath, rec.fromPath, "similar");
}

async function doit(){

    // load csv
    const csvstring = readFileSync('out/similarity.csv');
    const dupRecords = parse(csvstring, {
        columns: true,
        skip_empty_lines: true
      });
    console.log(dupRecords.length)
    
    dupRecords.forEach(dup => {
        console.log(dup);
        let rec = {}
        rec.dup = dup
        rec.fromPath = dup.from.replace('.webp','')
        rec.fromMeta = JSON.parse(readFileSync(rec.fromPath+'.meta.json'))
        rec.fromExt = rec.fromMeta.FileName.replace(/^.*(\..+)\s*$/,"$1")
        rec.fromName = rec.fromMeta.FileName.replace(/^(.*)\..+$/,"$1")
        rec.fromNameNumbers = rec.fromName.replace(/[^0-9]/g,'')
        rec.fromCreateDate = rec.fromMeta.DateTimeOriginal? rec.fromMeta.DateTimeOriginal.rawValue:
                                rec.fromMeta.FileModifyDate? rec.fromMeta.FileModifyDate.rawValue:
                                    null
        rec.toPath = dup.to.replace('.webp','')
        rec.toMeta = JSON.parse(readFileSync(rec.toPath+'.meta.json'))
        rec.toExt = rec.toMeta.FileName.replace(/^.*(\..+)\s*$/,"$1").toLowerCase()
        rec.toName = rec.toMeta.FileName.replace(/^(.*)\..+$/,"$1")
        rec.toNameNumbers = rec.toName.replace(/[^0-9]/g,'')
        rec.toCreateDate = rec.toMeta.DateTimeOriginal? rec.toMeta.DateTimeOriginal.rawValue:
                                rec.toMeta.FileModifyDate? rec.toMeta.FileModifyDate.rawValue:
                                    null

        const dist = dup.distance

        // Is truly dup?
        if (dist > .999) {
            console.log("it is a dup")
            processDup(rec)
        }

        else if (rec.fromName == rec.toName && dist > .97) {
            console.log("most likely a dup")
            processDup(rec)
        }

        else if (rec.fromCreateDate === rec.toCreateDate && dist > .99 && (!rec.fromNameNumbers || !rec.toNameNumbers)) {            
            console.log("most likely a dup, taken the same second with close distance")
            processDup(rec)
        }

        else if (rec.fromCreateDate === rec.toCreateDate && dist > .95 && rec.fromNameNumbers && rec.toNameNumbers && rec.fromNameNumbers == rec.toNameNumbers) {
            console.log("most likely a dup, taken the same second with similar numbered names")
            processDup(rec)
        }
        
        else if (rec.fromCreateDate === rec.toCreateDate && rec.fromNameNumbers && rec.toNameNumbers && rec.fromNameNumbers != rec.toNameNumbers) {
            console.log("it is similar and taken at the same second, numbered like it is in a series")
            processClose(rec)
        } 

        else if (rec.fromCreateDate === rec.toCreateDate) {
            console.log("it is similar and taken at the same second!")
            processClose(rec)
        } 

        // Or just similar?
        else {
            console.log("it is similar")
            processSimilar(rec)
        }
    });
}

doit();