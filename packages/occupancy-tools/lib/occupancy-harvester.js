'use strict';

/**
 * Be sure to export a keyfile as an env variable for Google like so:
 * export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
 * 
 * Be sure to export the Axis camera account that has read perms for the Occupancy Estimator API like so:
 * export AXISUSER=user
 * export AXISPASS=password
 */

import admin from 'firebase-admin';
import DigestFetch from 'digest-fetch';
import config from './occupancy-config.js';

export default class OccupancyHarvester {
  constructor(firebaseDBName="uvalib-api-occupancy", axisCreds) {
    this._firebaseDBName=firebaseDBName;
    this._firebaseDB = this._setupDB(this._firebaseDBName);
  }

  _setupDB(name){
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: `https://${name}.firebaseio.com`
    });
    return admin.database();
  }

  fetchOccupancy(){
    let promises = [];
    config.occupancyEstimators.forEach(oe=>{
      console.log(oe.userId + " " + oe.pass)
      const client = new DigestFetch(oe.userId, oe.pass, { algorithm: 'MD5' })
      promises.push(client.fetch(`http://${oe.domain}/local/occupancy-estimator/.api?live-occupancy.json`)
        .then(res => res.json())
        .then((data)=>{
          const ref = this._firebaseDB.ref(oe.fbpath);
          return ref.once("value").then(snapshot=>{
            var promises = [];
            var val = snapshot.val();
            var loggit = false;
            if (!val) val = {timestamp:null, value:null, totalIn:null, totalOut:null};
            var newval = {};
            if (data.occupancy<0) {
              console.error(new Error(`The occupancy estimator ${oe.domain} is returning a bad occupancy value: ${data.occupancy}`));
            }
            if (data.occupancy !== val.value) {
              newval.value = data.occupancy;
              loggit = true;
            }
            if (data['total in'] != val.totalIn) {
              newval.totalIn = data['total in'];
              loggit = true;
            }
            if (data['total out'] != val.totalOut) {
              newval.totalOut = data['total out'];
              loggit = true;
            }
            var newtimestamp = data.unixtime*1000;
            // log if occupancy changed
            if (loggit) {
              promises.push( this._firebaseDB.ref(oe.fblogpath+'/'+newtimestamp).set(newval).catch((error) => { console.error(error);}) );
            }
            // update main
            newval.timestamp = newtimestamp;
            promises.push( ref.update(newval).catch((error) => { console.error(error);}) );
            console.log(data);
            return Promise.all(promises);
          }).catch((error) => { console.error(error);});
        })
        .catch(e=>console.error(new Error(`Failed to fetch from endpoint at http://${oe.domain}/local/occupancy-estimator/.api?live-occupancy.json`)))
      );
    });
    
    return Promise.all(promises)
  }

}