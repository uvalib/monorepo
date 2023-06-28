'use strict';

/**
 * Be sure to export the Axis camera account that has read perms for the Occupancy Estimator API like so:
 * export AXISUSER=user
 * export AXISPASS=password
 */

import DigestFetch from 'digest-fetch';

import dateTime from 'date-and-time'; // use this NodeJS module to format date strings as needed
const headerObjJson = {'Content-Type': 'application/json'};

// Used to map the appropriate sensor name to its corresponding Springshare gate_id value;
// left in the other locations from the API for potential future use
const gateIDs = { 
    "SEL Main Entry C120": 3,
    "001A- 4th Floor - Main Entrance Camera 1" : 5,
    "OldCabell-B8A44F4F1939" : 6,
    "FiskeKimball-B8A44F4F195D" : 7,
    "TBD: Main": 4,
    "TBD: Harrison Small" : 18
};

export default class GateCounter {
    getGateCounts() {

        // This script would run once a day to pull the 24h bin for the previous day. So get the current date.
        const now = new Date();
        const today = dateTime.format(now,"YYYYMMDD") + "000000";

        console.info(`Getting gate counts: ${today}`);

        // need to get yesterday's date to align the count with the proper date when written to gate counts
        const daybefore = dateTime.addDays(now, -1);
        const yesterday = dateTime.format(daybefore, "YYYYMMDD"); // use this string in the URL to get the 24h bin JSON element
        const yesterHyphen = dateTime.format(daybefore, "YYYY-MM-DD") + " 00:00:00"; // use this string for the Springshare API

        // add *yesterday* variable defined above to the end of each url property to retrieve the data from the sensors
        const occupancyEstimators = [
            {loc: 'SEL', url: 'http://172.29.12.101/local/occupancy-estimator/.api?occupancy-export-json&res=24h&date='},
            {loc: 'Clemons', url: 'http://172.29.5.87/local/occupancy-estimator/.api?occupancy-export-json&res=24h&date='},
            {loc: 'FAL', url: 'http://172.29.8.29/local/people-counter/.api?export-json&res=24h&date='},
            {loc: 'Music', url: 'http://172.29.72.19/local/people-counter/.api?export-json&res=24h&date='}
        ]

        // array of JSON data to submit to the Springshare Gate Count API
        let gateLocationsData = [];
        let promises = [];
        try {
            occupancyEstimators.forEach((oe) => {
                const client = new DigestFetch(process.env.AXISUSER, process.env.AXISPASS, {algorithm: 'MD5'});
                const retryFetch = (client, url, retries=5) => {
                        return client.fetch(url)
                            .then(res => {
                                if (res.ok) return res;
                                if (retries>0) {
                                    return retryFetch(client, url, retries-1)
                                }
                                throw new Error(res.status)
                            }).catch((e)=>{
                                if (retries>0) {
                                    return retryFetch(client, url, retries-1)
                                } else {
                                    throw e;
                                }
                            })

                }
                promises.push(
                    retryFetch(client, oe.url+yesterday)
                        .then((res) => res.json())
                        .then((data) => {
                            // Process the data returned from each sensor
                            if (data.data[today]) {
                                let gateRecord = {
                                    'date': yesterHyphen,
                                    'gate_id': gateIDs[data.counter.name],
                                    'gate_start': data.data[today][2]
                                };
                                // depending on which sensor API is returned get the appropriate "total in" count 
                                gateRecord.gate_start = (data.data[today].length > 2) ? data.data[today][2] : data.data[today][0];
                                gateLocationsData.push(gateRecord);
                            }
                            return;
                        })
                        .catch((e) => console.error(`fetch from endpoint at ${oe.url}: ${e}`) ),
                );
            });
            Promise.all(promises)
            .then((data) => {
                if (gateLocationsData.length > 0) {
                    fetch(`https://virginia.libinsight.com/add.php?wid=34&type=5&token=${process.env.LIBINSIGHTTOKEN}&data=json`,
                    { method: 'POST', body: JSON.stringify(gateLocationsData), headers: headerObjJson })
                    .then(res => res.text())
                    .then(body => {
                        if (body) {
                            const result = JSON.parse(body);
                            if (result.response) {
                                console.info(`LibInsight Gate Count data write succeeded for ${yesterHyphen}`);
                            } else {
                                console.error(`LibInsight Gate Count data write failed for ${yesterHyphen}`);
                            }
                        }
                        return;
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            }
            return;
            })
            .catch((e) => {
                console.error(e);
            });
        } catch (e) {
            console.error(e);
        }


    }
}