#!/usr/bin/env node
import commandLineArgs from 'command-line-args';
import stringify from 'csv-stringify';

const optionDefinitions = [
    // one or more of 'clemons', 'fine-arts', 'music', ...
    { name: 'space', type: String, multiple: true },
    // clear cache of any previously downloaded logs for this request (if --to is not used so not to miss latest logs)
    { name: 'clearCache', type: Boolean}
  ]
const options = commandLineArgs(optionDefinitions)

//console.log(options.space)
//console.log(options)

let fs=null;

// json download url     
const jsonLogsBaseURL = "https://uvalib-api-occupancy.firebaseio.com/locationsLogs/";

async function doit(){
    if (options.space && Array.isArray(options.space)) {
        let spaceLogs = {}
        for (let i=0; i<options.space.length; i++) {
            const space = options.space[i];
            if(!fs) fs = await import('fs');
            const cachePath = `/var/tmp/occupancyLogs-${space}.json`;
            let rawlogs = null;
            if (!fs.existsSync(cachePath) || options.clearCache) {
                // fetch data and store it in cache
                const url = `${jsonLogsBaseURL}${space}/estimatedOccupancylog.json`
                //console.log(url)
                rawlogs = await fetch(url).then(r=>r.text()).catch(e=>console.error(`I had a problem "${e}" trying to get the raw logs from ${url}`))
                //console.log(rawlogs)
                fs.writeFileSync(cachePath, rawlogs)
            }
            if (!rawlogs) rawlogs = fs.readFileSync(cachePath);
            let logs = JSON.parse(rawlogs);
            spaceLogs[space] = logs;
            //console.log(rawlogs)
            let keys = Object.keys(logs).sort((a,b)=>(a-b));
            console.log(`found ${keys.length} log entries for ${space}`)
            // add missing data in time order
            let oin,oout,ovalue;
            keys.forEach(key=>{
                let row = logs[key];
                if (!row.totalIn && oin) row.totalIn = oin;
                if (!row.totalOut && oout) row.totalOut = oout;
                if (!row.value && ovalue) row.value = ovalue;
                row.space = space;
                oin = row.totalIn;
                oout = row.totalOut;
                ovalue = row.value;
            })
        }
        // join space data (arry) in time order
        let joined = [];
        let columns = {
            timestamp: "Timestamp",
            space: 'Space',
            totalIn: 'Total In',
            totalOut: 'Total Out',
            value: 'Occupancy'
        };
        Object.keys(spaceLogs).forEach(space=>{

        })
        // convert to csv and return
    }
}

doit();