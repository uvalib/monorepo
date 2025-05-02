#!/usr/bin/env node
import { config } from 'dotenv';
import GateCounter from './gate-counter.js';
import LibraryHours from './library-hours.js';
config();
// Default Drupal base URL for library site if not set
process.env.DRUPAL_BASE_URL = process.env.DRUPAL_BASE_URL || 'https://library.virginia.edu';
class OccupancyPoller {
    constructor() {
        // Initialize gateCounter with an instance of GateCounter class
        this.gateCounter = new GateCounter();
        this.libraryHours = new LibraryHours();
        // Record the current day of the month (1-31)
        this.lastGateCountDay = new Date().getDate();
        // Call the getGateCounts method immediately when an instance of OccupancyPoller is created.
        // This ensures that data is fetched as soon as the script starts, without waiting for the interval.
        this.gateCounter.getGateCounts();
        // Initial library hours check via LibraryHours module
        this.libraryHours.checkLibraryHours();
    }
    // The startPolling method takes an interval (in milliseconds) as a parameter
    // and schedules the getGateCounts method to be called repeatedly at that interval.
    startPolling(interval) {
        setInterval(() => {
            // Get the current day of the month
            const nowDay = new Date().getDate();
            // If the current day is different from the last recorded day,
            // call the getGateCounts method and update the last recorded day.
            // This logic ensures that getGateCounts is called once a day.
            if (nowDay !== this.lastGateCountDay) {
                this.lastGateCountDay = nowDay;
                this.gateCounter.getGateCounts();
            }
        }, interval); // The interval at which the function inside setInterval is executed
    }
    // Start hourly library hours polling
    startHourlyLibraryCheck(interval) {
        setInterval(() => this.libraryHours.checkLibraryHours(), interval);
    }
}
// Define the interval (in milliseconds) for polling.
// Here, POLL_INTERVAL is set to 3600000 milliseconds which is equal to 1 hour.
const POLL_INTERVAL = 3600000;
// Create an instance of the OccupancyPoller class.
const occupancyPoller = new OccupancyPoller();
// Call the startPolling method with the polling interval.
// This schedules the getGateCounts method to be called at regular intervals.
occupancyPoller.startPolling(POLL_INTERVAL);
occupancyPoller.startHourlyLibraryCheck(POLL_INTERVAL);
