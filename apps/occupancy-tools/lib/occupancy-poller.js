#!/usr/bin/env node
import GC from './gate-counter.js';

const gateCounter = new GC();

// Gate counts should only be fetched once a day in the early morn
let lastGateCountDay = new Date().getDate();  // start first thing tomorrow as today might have already been fetched
setInterval(function() {
  const nowDay = new Date().getDate();
  if (nowDay != lastGateCountDay) {  // it's a new day!
    lastGateCountDay = nowDay;
    gateCounter.getGateCounts();
  }
}, 360000);  // check for the start of the day every hour