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
        const yesterHyphen = dateTime.format(dateTime.addDays(now, -1), "YYYY-MM-DD") + " 00:00:00";
        console.info(`Getting gate counts: ${today}`);
        // Define the endpoints for different locations
        // Make sure to supply the correct gateID for each location
        const occupancyEstimators = [
            { loc: 'SEL', gateID: 3, url: 'http://172.29.12.101/local/occupancy-estimator/.api?occupancy-export-json&res=24h&date=' },
            { loc: 'Clemons', gateID: 5, url: 'http://172.29.5.87/local/occupancy-estimator/.api?occupancy-export-json&res=24h&date=' },
            { loc: 'FAL', gateID: 7, url: 'http://172.29.8.29/local/people-counter/.api?export-json&res=24h&date=' },
            { loc: 'Music', gateID: 6, url: 'http://172.29.72.19/local/people-counter/.api?export-json&res=24h&date=' },
            {
                loc: 'Shannon',
                gateID: 4,
                software: "3d",
                urls: [
                    'http://172.29.3.47',
                    'http://172.29.3.48',
                    'http://172.29.3.49',
                    'http://172.29.3.50',
                    'http://172.29.3.51',
                    'http://172.29.3.52',
                    'http://172.29.3.53',
                    'http://172.29.3.54',
                    'http://172.29.3.55',
                    'http://172.29.3.56',
                    'http://172.29.3.57',
                    'http://172.29.3.58',
                    'http://172.29.3.59',
                    'http://172.29.3.60'
                ].map(url => `${url}/a3dpc/api/export/json?start=yesterday&end=today&resolution=day`)
            }
        ];
        // Initialize the digest-fetch client with authentication
        const client = new DigestFetch(process.env.AXISUSER, process.env.AXISPASS, { algorithm: 'MD5' });
        // Fetch and process data from all endpoints
        let gateLocationsData = [];
        for (const oe of occupancyEstimators) {
            // Handle 3D cameras
            if (oe.software === '3d' && oe.urls) {
                const fetchPromises = oe.urls.map(url => this.retryFetch(client, url, MAX_RETRIES));
                const results = await Promise.all(fetchPromises);
                let totalInCount = 0;
                let cameraErrorDetected = false;
                results.forEach((data) => {
                    if (!data || data.error) {
                        cameraErrorDetected = true;
                    }
                });
                if (cameraErrorDetected) {
                    totalInCount = -1;
                    console.warn(`One or more 3D cameras for location ${oe.loc} failed. Setting total count to -1.`);
                }
                else {
                    results.forEach((data) => {
                        var _a;
                        if (((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                            totalInCount += data.data.reduce((sum, item) => sum + item.in, 0);
                        }
                    });
                }
                gateLocationsData.push({
                    date: yesterHyphen,
                    gate_id: oe.gateID,
                    gate_start: totalInCount
                });
                console.info(`Data processed for 3D cameras at location ${oe.loc}. Total in count: ${totalInCount}`);
                // Handle “normal” (non-3D) cameras
            }
            else if (oe.url) {
                const url = oe.url + dateTime.format(dateTime.addDays(now, -1), "YYYYMMDD");
                const data = await this.retryFetch(client, url, MAX_RETRIES);
                if (!data || data.error) {
                    // If request failed or data is missing, record -1
                    console.warn(`Data could not be fetched for endpoint ${oe.loc}. Setting gate count to -1.`);
                    gateLocationsData.push({
                        date: yesterHyphen,
                        gate_id: oe.gateID,
                        gate_start: -1
                    });
                }
                else if (data.data[today]) {
                    // Use whichever index is appropriate; in many Axis cameras, [2] is "in count"
                    const value = data.data[today].length > 2 ? data.data[today][2] : data.data[today][0];
                    gateLocationsData.push({
                        date: yesterHyphen,
                        gate_id: oe.gateID,
                        gate_start: value
                    });
                    console.info(`Data processed for endpoint ${oe.loc}. Gate count: ${value}`);
                }
                else {
                    // If data[today] is missing, also record -1
                    console.warn(`No data[today] found for endpoint ${oe.loc}. Setting gate count to -1.`);
                    gateLocationsData.push({
                        date: yesterHyphen,
                        gate_id: oe.gateID,
                        gate_start: -1
                    });
                }
            }
        }
        // Send the accumulated data to LibInsight
        if (gateLocationsData.length > 0) {
            console.info("Sending data to LibInsight...");
            console.info(JSON.stringify(gateLocationsData));
            try {
                const response = await fetch(`https://virginia.libinsight.com/add.php?wid=34&type=5&token=${process.env.LIBINSIGHTTOKEN}&data=json`, {
                    method: 'POST',
                    body: JSON.stringify(gateLocationsData),
                    headers: headerObjJson
                });
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
        console.info(`Fetching data from ${url}`);
        try {
            const response = await client.fetch(url);
            if (response.ok) {
                console.info(`Data successfully fetched from ${url}`);
                return response.json();
            }
            console.warn(`Failed to fetch data from ${url}. Retries left: ${retries}`);
            if (retries > 0) {
                return this.retryFetch(client, url, retries - 1);
            }
            // All retries exhausted, return { error: true }
            console.error(`Max retries reached for url: ${url}. Returning data with -1 indication.`);
            return { error: true };
        }
        catch (error) {
            console.error(`Error while fetching data from ${url}: ${error}`);
            if (retries > 0) {
                return this.retryFetch(client, url, retries - 1);
            }
            // If also fails on last retry, return an error object
            console.error(`Max retries reached for url: ${url}. Returning data with -1 indication.`);
            return { error: true };
        }
    }
}
export default GateCounter;
