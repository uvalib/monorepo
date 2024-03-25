import DigestFetch from 'digest-fetch';
import dateTime from 'date-and-time';

// Constants for configuration
const GATE_COUNT_INTERVAL = 360000; // 1 hour in milliseconds
const MAX_RETRIES = 5; // Maximum number of retries for fetching data
const headerObjJson = { 'Content-Type': 'application/json' }; // Headers for POST request

// Define the structure of GateRecord
interface GateRecord {
    date: string;
    gate_id: number;
    gate_start: number;
}

// Define the structure of OccupancyEstimator
interface OccupancyEstimator {
    loc: string;
    gateID?: number;
    software?: string;
    url?: string;
    urls?: string[];
}

// Define the structure of Data
interface Data {
    counter: {
        name: keyof typeof gateIDs;
    };
    data: {
        [key: string]: number[];
    };
}

// Define the structure for 3D camera data
interface Camera3DData {
    data: {
        start: string;
        end: string;
        in: number;
        out: number;
        adults_in: number;
        adults_out: number;
    }[];
}

class GateCounter {
    async getGateCounts(): Promise<void> {
        // Get the current date
        const now = new Date();
        const today = dateTime.format(now, "YYYYMMDD") + "000000";
        const yesterHyphen = dateTime.format(dateTime.addDays(now, -1), "YYYY-MM-DD") + " 00:00:00";

        console.info(`Getting gate counts: ${today}`);

        // Define the endpoints for different locations
        const occupancyEstimators: OccupancyEstimator[] = [
            { loc: 'SEL', url: 'http://172.29.12.101/local/occupancy-estimator/.api?occupancy-export-json&res=24h&date=' },
            { loc: 'Clemons', url: 'http://172.29.5.87/local/occupancy-estimator/.api?occupancy-export-json&res=24h&date=' },
            { loc: 'FAL', url: 'http://172.29.8.29/local/people-counter/.api?export-json&res=24h&date=' },
            { loc: 'Music', url: 'http://172.29.72.19/local/people-counter/.api?export-json&res=24h&date=' },
            { loc: 'Shannon', gateID: 4, software: "3d", urls: ['http://172.29.3.47', 'http://172.29.3.48', 'http://172.29.3.49', 'http://172.29.3.50', 'http://172.29.3.51', 'http://172.29.3.52', 'http://172.29.3.53', 'http://172.29.3.54', 'http://172.29.3.55', 'http://172.29.3.56', 'http://172.29.3.57', 'http://172.29.3.58', 'http://172.29.3.59', 'http://172.29.3.60'].map(url => `${url}/a3dpc/api/export/json?start=yesterday&end=today&resolution=day`) }
        ];

        // Initialize the digest-fetch client with authentication
        const client = new DigestFetch(process.env.AXISUSER, process.env.AXISPASS, { algorithm: 'MD5' });

        // Fetch and process data from all endpoints
        let gateLocationsData: GateRecord[] = [];
        for (const oe of occupancyEstimators) {
            if (oe.software === '3d' && oe.urls && oe.gateID) {
                // Handle 3D camera software
                const fetchPromises = oe.urls.map(url => this.retryFetch(client, url, MAX_RETRIES));
                const results = await Promise.all(fetchPromises);

                let totalInCount = 0;
                results.forEach((data: Camera3DData) => {
                    if (data && data.data.length > 0) {
                        totalInCount += data.data.reduce((sum, item) => sum + item.in, 0);
                    }
                });

                gateLocationsData.push({ date: yesterHyphen, gate_id: oe.gateID, gate_start: totalInCount });
                console.info(`Data processed for 3D cameras at location ${oe.loc}. Total in count: ${totalInCount}`);
            } else if (oe.url) {
                // Handle other camera software
                const data: Data = await this.retryFetch(client, oe.url + dateTime.format(dateTime.addDays(now, -1), "YYYYMMDD"), MAX_RETRIES);
                if (data && data.data[today]) {
                    let gateRecord: GateRecord = {
                        date: yesterHyphen,
                        gate_id: gateIDs[data.counter.name],
                        gate_start: data.data[today][2]
                    };
                    gateRecord.gate_start = (data.data[today].length > 2) ? data.data[today][2] : data.data[today][0];
                    gateLocationsData.push(gateRecord);
                    console.info(`Data processed for endpoint ${oe.loc}.`);
                }
            }
        }

        // Send the accumulated data to LibInsight
        if (gateLocationsData.length > 0) {
            console.info("Sending data to LibInsight...");
            console.info(JSON.stringify(gateLocationsData));
            try {
                const response = await fetch(`https://virginia.libinsight.com/add.php?wid=34&type=5&token=${process.env.LIBINSIGHTTOKEN}&data=json`,
                    { method: 'POST', body: JSON.stringify(gateLocationsData), headers: headerObjJson });

                const responseBody = await response.text();
                const result = JSON.parse(responseBody);

                if (result.response) {
                    console.info(`LibInsight Gate Count data write succeeded for ${yesterHyphen}`);
                } else {
                    console.error(`LibInsight Gate Count data write failed for ${yesterHyphen}`);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            console.warn("No data to send to LibInsight.");
        }
    }

    // Function to fetch data from a URL with retry logic in case of failure
    private async retryFetch(client: any, url: string, retries: number): Promise<any> {
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
        } catch (error) {
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
