import DigestFetch from 'digest-fetch';

// Represents a single gate or location endpoint to fetch occupancy data from
export interface OccupancyEstimator {
    loc: string;
    slug?: string;
    gateID: number;
    resetURL?: string;
    software?: string;
    url?: string;
    urls?: string[];
}

// Represents the shape of 3D camera data responses
export interface Camera3DData {
    data: {
        start: string;
        end: string;
        in: number;
        out: number;
        adults_in: number;
        adults_out: number;
    }[];
    error?: boolean;
}

// List of endpoints for each location/gate
export const occupancyEstimators: OccupancyEstimator[] = [
    { loc: 'SEL', gateID: 3, url: 'http://172.29.12.101/local/occupancy-estimator/.api?occupancy-export-json&res=24h&date=' },
    { loc: 'Clemons', slug: 'clemons', gateID: 5, resetURL: 'http://172.29.5.87/local/people-counter/.api?occupancy-reset&occ=0', url: 'http://172.29.5.87/local/occupancy-estimator/.api?occupancy-export-json&res=24h&date=' },
    { loc: 'FAL', gateID: 7, url: 'http://172.29.8.29/local/people-counter/.api?export-json&res=24h&date=' },
    { loc: 'Music', gateID: 6, url: 'http://172.29.72.19/local/people-counter/.api?export-json&res=24h&date=' },
    {
        loc: 'Shannon',
        gateID: 4,
        software: '3d',
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
        ].map(u => `${u}/a3dpc/api/export/json?start=yesterday&end=today&resolution=day`)
    }
];

// Create a DigestFetch client with credentials from environment
export function createClient() {
    return new DigestFetch(process.env.AXISUSER, process.env.AXISPASS, { algorithm: 'MD5' });
}

// Retry fetching data from a URL up to N times
export async function retryFetch(client: any, url: string, retries: number): Promise<any> {
    console.info(`Fetching data from ${url}`);
    try {
        const response = await client.fetch(url);
        if (response.ok) {
            console.info(`Data successfully fetched from ${url}`);
            return response.json();
        }
        console.warn(`Failed to fetch data from ${url}. Retries left: ${retries}`);
        if (retries > 0) {
            return retryFetch(client, url, retries - 1);
        }
        console.error(`Max retries reached for url: ${url}. Returning error flag.`);
        return { error: true };
    } catch (error) {
        console.error(`Error while fetching data from ${url}: ${error}`);
        if (retries > 0) {
            return retryFetch(client, url, retries - 1);
        }
        return { error: true };
    }
}

/**
 * Reset occupancy counter for a given library slug using digest authentication.
 * @param slug The slug identifying the library in occupancyEstimators
 * @param retries Number of retry attempts
 */
export async function resetCounterBySlug(slug: string, retries = 5): Promise<any> {
    const estimator = occupancyEstimators.find(e => e.slug === slug);
    if (!estimator) {
        throw new Error(`No occupancy estimator found for slug: ${slug}`);
    }
    if (!estimator.resetURL) {
        throw new Error(`Reset URL not defined for slug: ${slug}`);
    }
    const client = createClient();
    return retryFetch(client, estimator.resetURL, retries);
}
