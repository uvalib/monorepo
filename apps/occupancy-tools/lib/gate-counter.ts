import DigestFetch from 'digest-fetch';
import dateTime from 'date-and-time';

const GATE_COUNT_INTERVAL = 360000; // 1 hour
const MAX_RETRIES = 5;
const headerObjJson = { 'Content-Type': 'application/json' };

interface GateRecord {
    date: string;
    gate_id: number;
    gate_start: number;
}

interface OccupancyEstimator {
    loc: string;
    url: string;
}

interface Data {
    counter: {
        name: keyof typeof gateIDs;
    };
    data: {
        [key: string]: number[];
    };
}

class GateCounter {
    async getGateCounts(): Promise<void> {
        const now = new Date();
        const today = dateTime.format(now, "YYYYMMDD") + "000000";

        console.info(`Getting gate counts: ${today}`);

        const daybefore = dateTime.addDays(now, -1);
        const yesterday = dateTime.format(daybefore, "YYYYMMDD");
        const yesterHyphen = dateTime.format(daybefore, "YYYY-MM-DD") + " 00:00:00";

        const occupancyEstimators: OccupancyEstimator[] = [
            { loc: 'SEL', url: 'http://172.29.12.101/local/occupancy-estimator/.api?occupancy-export-json&res=24h&date=' },
            { loc: 'Clemons', url: 'http://172.29.5.87/local/occupancy-estimator/.api?occupancy-export-json&res=24h&date=' },
            { loc: 'FAL', url: 'http://172.29.8.29/local/people-counter/.api?export-json&res=24h&date=' },
            { loc: 'Music', url: 'http://172.29.72.19/local/people-counter/.api?export-json&res=24h&date=' }
        ];

        const client = new DigestFetch(process.env.AXISUSER, process.env.AXISPASS, { algorithm: 'MD5' });

        const fetchPromises = occupancyEstimators.map(oe => this.retryFetch(client, oe.url + yesterday, MAX_RETRIES));

        console.info("Fetching data from all endpoints in parallel...");

        const results = await Promise.all(fetchPromises);

        console.info("Data fetched from all endpoints.");

        let gateLocationsData: GateRecord[] = [];

        results.forEach((data: Data, index: number) => {
            if (data && data.data[today]) {
                let gateRecord: GateRecord = {
                    date: yesterHyphen,
                    gate_id: gateIDs[data.counter.name],
                    gate_start: data.data[today][2]
                };
                gateRecord.gate_start = (data.data[today].length > 2) ? data.data[today][2] : data.data[today][0];
                gateLocationsData.push(gateRecord);
                console.info(`Data processed for endpoint ${occupancyEstimators[index].loc}.`);
            }
        });

        if (gateLocationsData.length > 0) {
            console.info("Sending data to LibInsight...");

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

    private async retryFetch(client: any, url: string, retries: number): Promise<any> {
        try {
            console.info(`Fetching data from ${url}`);
            const response = await client.fetch(url);

            if (response.ok) {
                console.info(`Data successfully fetched from ${url}`);
                return response.json();
            }

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

const gateIDs = {
    "SEL Main Entry C120": 3,
    "001A- 4th Floor - Main Entrance Camera 1": 5,
    "OldCabell-B8A44F4F1939": 6,
    "FiskeKimball-B8A44F4F195D": 7,
    "TBD: Main": 4,
    "TBD: Harrison Small": 18
};

export default GateCounter;
