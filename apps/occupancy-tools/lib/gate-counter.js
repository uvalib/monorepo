import DigestFetch from 'digest-fetch';
import dateTime from 'date-and-time';
// Constants for configuration
const GATE_COUNT_INTERVAL = 360000; // 1 hour in milliseconds
const MAX_RETRIES = 5; // Maximum number of retries for fetching data
const headerObjJson = { 'Content-Type': 'application/json' }; // Headers for POST request
class GateCounter {
    async getGateCounts() {
        // Get the current date
        const now = new Date();
        const today = dateTime.format(now, "YYYYMMDD") + "000000";
        console.info(`Getting gate counts: ${today}`);
        // Calculate the date for the day before
        const daybefore = dateTime.addDays(now, -1);
        const yesterday = dateTime.format(daybefore, "YYYYMMDD");
        const yesterHyphen = dateTime.format(daybefore, "YYYY-MM-DD") + " 00:00:00";
        // Define the endpoints for different locations
        const occupancyEstimators = [
            { loc: 'SEL', url: 'http://172.29.12.101/local/occupancy-estimator/.api?occupancy-export-json&res=24h&date=' },
            { loc: 'Clemons', url: 'http://172.29.5.87/local/occupancy-estimator/.api?occupancy-export-json&res=24h&date=' },
            { loc: 'FAL', url: 'http://172.29.8.29/local/people-counter/.api?export-json&res=24h&date=' },
            { loc: 'Music', url: 'http://172.29.72.19/local/people-counter/.api?export-json&res=24h&date=' }
        ];
        // Initialize the digest-fetch client with authentication
        const client = new DigestFetch(process.env.AXISUSER, process.env.AXISPASS, { algorithm: 'MD5' });
        // Fetch data from all endpoints in parallel
        const fetchPromises = occupancyEstimators.map(oe => this.retryFetch(client, oe.url + yesterday, MAX_RETRIES));
        console.info("Fetching data from all endpoints in parallel...");
        const results = await Promise.all(fetchPromises);
        console.info("Data fetched from all endpoints.");
        // Process and accumulate the fetched data
        let gateLocationsData = [];
        results.forEach((data, index) => {
            if (data && data.data[today]) {
                let gateRecord = {
                    date: yesterHyphen,
                    gate_id: gateIDs[data.counter.name],
                    gate_start: data.data[today][2]
                };
                gateRecord.gate_start = (data.data[today].length > 2) ? data.data[today][2] : data.data[today][0];
                gateLocationsData.push(gateRecord);
                console.info(`Data processed for endpoint ${occupancyEstimators[index].loc}.`);
            }
        });
        // Send the accumulated data to LibInsight
        if (gateLocationsData.length > 0) {
            console.info("Sending data to LibInsight...");
            try {
                const response = await fetch(`https://virginia.libinsight.com/add.php?wid=34&type=5&token=${process.env.LIBINSIGHTTOKEN}&data=json`, { method: 'POST', body: JSON.stringify(gateLocationsData), headers: headerObjJson });
                const responseBody = await response.text();
                const result = JSON.parse(responseBody);
                if (result.response) {
                    console.info(`LibInsight Gate Count data write succeeded for ${yesterHyphen}`);
                }
                else {
                    console.error(`LibInsight Gate Count data write failed for ${yesterHyphen}`);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        else {
            console.warn("No data to send to LibInsight.");
        }
    }
    // Function to fetch data from a URL with retry logic in case of failure
    async retryFetch(client, url, retries) {
        try {
            console.info(`Fetching data from ${url}`);
            const response = await client.fetch(url);
            // If the response is successful, return the data
            if (response.ok) {
                console.info(`Data successfully fetched from ${url}`);
                return response.json();
            }
            // If the response is not successful and there are retries left, retry fetching
            console.warn(`Failed to fetch data from ${url}. Retries left: ${retries}`);
            if (retries > 0) {
                return this.retryFetch(client, url, retries - 1);
            }
            throw new Error(`Max retries reached for url: ${url}`);
        }
        catch (error) {
            console.error(`Error while fetching data from ${url}: ${error}`);
            if (retries > 0) {
                return this.retryFetch(client, url, retries - 1);
            }
            throw error;
        }
    }
}
// Define the gate IDs
const gateIDs = {
    "SEL Main Entry C120": 3,
    "001A- 4th Floor - Main Entrance Camera 1": 5,
    "OldCabell-B8A44F4F1939": 6,
    "FiskeKimball-B8A44F4F195D": 7,
    "TBD: Main": 4,
    "TBD: Harrison Small": 18
};
export default GateCounter;
