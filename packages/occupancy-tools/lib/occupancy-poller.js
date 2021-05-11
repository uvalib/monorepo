#!/usr/bin/env node
import OH from './occupancy-harvester.js';
import OF from './hours-fetcher.js';

const harvester = new OH()
const hoursFetcher = new OF();

harvester.fetchOccupancy();
// run every minute
setInterval( function(){ harvester.fetchOccupancy() }, 60000 ); // get occupancy every minute

hoursFetcher.fetchHours();
setInterval( function(){ harvester.fetchHours() }, 3600000); // hourly get hours calendar