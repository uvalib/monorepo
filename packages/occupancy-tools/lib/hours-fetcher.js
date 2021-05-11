import fetch from 'node-fetch';
import OccupancyBase from './occupancy-base.js';

export default class HoursFetcher extends OccupancyBase {
  constructor(){
    super();
    this._firebaseAPIDB = this._setupDB("https://uvalib-api.firebaseio.com/");
  }

  fetchHours(){
    return this._firebaseAPIDB.ref('libraries').once("value",libraries=>{  

      var hoursKeys = libraries.val().reduce( (a,c)=>{ a[c.slug]=c.libcalID; return a;} ,{} )
    
      return this._firebaseDB.ref('locations-schemaorg/location').once("value",loc=>{
        var promises = [];
        let locations = loc.val();
        for (const key in locations) {
          const location = locations[key];
          if (location["@type"]==="Library" && hoursKeys[key])
          promises.push ( 
            fetch(this.config.libraryHours.libcalURL+hoursKeys[key])
              .then(res=>res.json())
              .then(json=>{
                console.log(`Got hours for ${key}`);
                if (json.openingHoursSpecification)
                  return this._firebaseDB.ref(`locations-schemaorg/location/${key}/openingHoursSpecification`)
                    .set(json.openingHoursSpecification)
                    .catch((error) => { this._logError(error); });
                else
                  return Promise.resolve();  
              }).catch((error) => { this._logError(error); })
          );
        }
        return Promise.all(promises);
      }).catch((error) => { this._logError(error); });
    
    }).catch((error) => { this._logError(error); });    
  }
}