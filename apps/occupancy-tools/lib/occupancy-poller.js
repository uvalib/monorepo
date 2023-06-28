#!/usr/bin/env node
import OH from './occupancy-harvester.js';
import OF from './hours-fetcher.js';
import OA from './hours-analyzer.js';
import GC from './gate-counter.js';

const harvester = new OH();
const hoursFetcher = new OF();
const hoursAnalyzer = new OA();
const gateCounter = new GC();

harvester.fetchOccupancy();
// run every minute
setInterval(function () {
  harvester.fetchOccupancy();
}, 60000); // get occupancy every minute

hoursFetcher.fetchHours();
setInterval(function () {
  hoursFetcher.fetchHours();
}, 3600000); // hourly get hours calendar

hoursAnalyzer.isOpenClosed();
setInterval(function () {
  hoursAnalyzer.isOpenClosed();
}, 120000); // set open or closed status for libraries

// Gate counts should only be fetched once a day in the early morn
let lastGateCountDay = new Date().getDate();  // start first thing tomorrow as today might have already been fetched
setInterval(function() {
  const nowDay = new Date().getDate();
  if (nowDay != lastGateCountDay) {  // it's a new day!
    lastGateCountDay = nowDay;
    gateCounter.getGateCounts();
  }
}, 360000);  // check for the start of the day every hour