'use strict';

/**
 * Be sure to export a keyfile as an env variable for Google like so:
 * export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
 */

import {admin, app} from './firebase-config.js';
import config from './occupancy-config.js';

export default class OccupancyBase {
  constructor(firebaseDBName="uvalib-api-occupancy") {
    this.config = config;
    this._fbAdmin = admin;
    this._fbApp = app;
    this._firebaseDBName=firebaseDBName;
    this._firebaseDBURL=`https://${this._firebaseDBName}.firebaseio.com`;
    this._firebaseDB = this._setupDB(this._firebaseDBURL);
  }

  _setupDB(url){  
    return app.database(url);
  }

  _logInfo(msg){
    console.info("INFO "+msg);
  }

  _logWarning(msg){
    console.warn("WARNING "+msg);
  }

  _logError(msg){
    console.error(new Error("ERROR "+msg));  
  }

}