#!/usr/bin/env node
import OH from './occupancy-harvester.js'

const harvester = new OH()

harvester.fetchOccupancy();
// run every minute
setInterval( function(){ harvester.fetchOccupancy() }, 60000 );