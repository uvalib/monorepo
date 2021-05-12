import fetch from 'node-fetch';
import OccupancyBase from './occupancy-base.js';
import { DateTime } from 'luxon';

export default class HoursAnalyzer extends OccupancyBase {
  isOpenClosed() {
    this._logInfo('determining open/closed...');
    var now = DateTime.now().setZone('America/New_York');

    // fetch libraries from Drupal so that we don't have to wait for overrides to make it to our api
    return fetch('https://drupal.lib.virginia.edu/libs?_format=json')
      .then((res) => res.json())
      .then((d) => {
        return this._firebaseDB
          .ref('locations-schemaorg/location')
          .once('value', (loc) => {
            let locations = loc.val();
            var promises = [];
            for (const key in locations) {
              const location = locations[key];

              var drupalLoc = d.find((l) => l['field_slug'][0].value == key);
              var openagain = false;
              if (
                drupalLoc &&
                drupalLoc['field_closure_override'] &&
                drupalLoc['field_closure_override'].length > 0
              ) {
                openagain = DateTime.fromSeconds(
                  drupalLoc['field_closure_override'][0].value,
                );
                if (
                  now <= openagain &&
                  location.tempClosed != openagain.toMillis()
                )
                  this._logInfo(`${key} is temp closed till ${openagain}`);
                promises.push(
                  this._firebaseDB
                    .ref('locations-schemaorg/location/' + key + '/tempClosed')
                    .set(openagain.toMillis())
                    .catch((error) => {
                      this._logError(error);
                    }),
                );
              }

              var isOpen = false;
              // eval if the loc is open currently
              if (Array.isArray(location.openingHoursSpecification)) {
                var todays = location.openingHoursSpecification.find((d) => {
                  return (
                    DateTime.fromISO(
                      d.validFrom + 'T' + d.opens + ':00',
                    ).toMillis() <= now.toMillis() &&
                    now.toMillis() <=
                      DateTime.fromISO(
                        d.validThrough + 'T' + d.closes + ':00',
                      ).toMillis()
                  );
                });
                // if we have a day, then the location is currently open)
                if (now <= openagain) todays = false;
                if (location.isOpenNow != !!todays)
                  promises.push(
                    this._firebaseDB
                      .ref('locations-schemaorg/location/' + key + '/isOpenNow')
                      .set(!!todays)
                      .catch((error) => {
                        this._logError(error);
                      }),
                  );
                this._logInfo(
                  `${key} is currently ${!!todays ? 'open' : 'closed'}`,
                );
              }
            }
            return Promise.all(promises);
          })
          .catch((error) => {
            this._logError(error);
          });
      })
      .catch((error) => {
        this._logError(error);
      });
  }
}
