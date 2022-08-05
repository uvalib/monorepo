'use strict';

/**
 * Be sure to export a keyfile as an env variable for Google like so:
 * export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
 *
 * Be sure to export the Axis camera account that has read perms for the Occupancy Estimator API like so:
 * export AXISUSER=user
 * export AXISPASS=password
 */

import OccupancyBase from './occupancy-base.js';
import DigestFetch from 'digest-fetch';


export default class OccupancyHarvester extends OccupancyBase {
  fetchOccupancy() {
    this._logInfo('fetching occupancy...');
    let promises = [];
    try {
      this.config.occupancyEstimators.forEach((oe) => {
        if (!oe.userId || !oe.pass) {
          this._logError(
            `Missing userid and/or password for camera - ${oe.name}`,
          );
          throw new Error(`Missing userid and/or password`);
          return;
        }
        const client = new DigestFetch(oe.userId, oe.pass, {algorithm: 'MD5'});
        const retryFetch = (client, url, retries=5) => {
            //console.info("Attempt to fetch "+url)
            return client.fetch(url)
              .then(res => {
                if (res.ok) return res;
                if (retries>0) {
                  console.info("Trying to fetch again since we got "+res.status);
                  return retryFetch(client, url, retries-1)
                }
                throw new Error(res.status)
              }).catch((e)=>{
                //console.info("Error!!!!!!!!!!!!!!!!!!")
                if (retries>0) {
                  console.info("Trying to fetch again since we got "+e.message);
                  return retryFetch(client, url, retries-1)
                } else {
                  throw e;
                }
              })

        }
        promises.push(
          retryFetch(client, `http://${oe.domain}/local/occupancy-estimator/.api?live-occupancy.json`)
//          client
//            .fetch(
//              `http://${oe.domain}/local/occupancy-estimator/.api?live-occupancy.json`,
//            )
            .then((res) => res.json())
            .then((data) => {
              if (oe.fbpath && oe.fbpath.length>0) {
                if (data.occupancy < 0) {
                  this._logError(
                    `The occupancy estimator ${oe.domain} - ${oe.name} is returning a bad occupancy value: ${data.occupancy}`,
                  );
                  throw new Error(`Count can't be less than zero!!!`);
                }

                return Promise.all( oe.fbpath.map(writePath=>{

                  let ref = this._firebaseDB.ref(writePath);
                  return ref
                    .once('value')
                    .then((snapshot) => {
                      var promises = [];
                      var val = snapshot.val();
                      var loggit = false;
                      if (!val)
                        val = {
                          timestamp: null,
                          value: null,
                          totalIn: null,
                          totalOut: null,
                        };
                      var newval = {};
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
                      var newtimestamp = data.unixtime * 1000;
                      // log if occupancy changed
                      if (loggit) {
                        promises.push(
                          this._firebaseDB
                            .ref(oe.fblogpath + '/' + newtimestamp)
                            .set(newval)
                            .catch((error) => {
                              this._logError(error);
                            }),
                        );
                      }
                      // update main
                      newval.timestamp = newtimestamp;
                      promises.push(
                        ref.update(newval).catch((error) => {
                          this._logError(error);
                        }),
                      );
                      this._logInfo(
                        `${oe.name} occupancy at ${data.occupancy} currently`,
                      );
                      return Promise.all(promises);
                    })
                    .catch((error) => {
                      this._logError(error);
                    });

                }) );

              }
            })
            .catch((e) =>
              this._logError(
                `fetch from endpoint at http://${oe.domain}/local/occupancy-estimator/.api?live-occupancy.json: ${e}`,
              ),
            ),
        );
      });
    } catch (e) {
      this._logError(e);
    }
    return Promise.all(promises);
  }
}
