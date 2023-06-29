#!/usr/bin/env node
import GateCounter from './gate-counter.js';

class OccupancyPoller {
    private gateCounter: GateCounter;
    private lastGateCountDay: number;

    constructor() {
        this.gateCounter = new GateCounter();
        this.lastGateCountDay = new Date().getDate();

        // Immediately call getGateCounts upon construction
        this.gateCounter.getGateCounts();
    }

    startPolling(interval: number): void {
        setInterval(() => {
            const nowDay = new Date().getDate();
            if (nowDay !== this.lastGateCountDay) {
                this.lastGateCountDay = nowDay;
                this.gateCounter.getGateCounts();
            }
        }, interval);
    }
}

const POLL_INTERVAL = 3600000; // 1 hour in milliseconds

const occupancyPoller = new OccupancyPoller();
occupancyPoller.startPolling(POLL_INTERVAL);
