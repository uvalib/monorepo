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
