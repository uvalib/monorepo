// Importing the required modules
import functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { CatalogData } from '@uvalib/data-wrap/CatalogData.js';

const app = express();
app.use(cors({ origin: true }));

// Virgo Catalog Search endpoint
app.get('/virgoCatalogSearch', async (req, res) => {
    try {
        // Extracting query parameters
        const query = req.query.query || ''; // Default search term if none provided
        const limit = req.query.limit || 20; // Default limit if not specified

        // Fetching catalog data
        let catalogData = new CatalogData({ query, limit:parseInt(limit) });
        const results = await catalogData.fetchData();

        // Responding with results
        res.json({ message: "Catalog search results", data: results.items });
    } catch (error) {
        console.error("Error fetching catalog data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Item details endpoint
app.get('/item/:id', (req, res) => {
    const itemId = req.params.id;
    res.json({ message: `Details for item ${itemId}`, data: {} }); // Dummy response for item details
});

// Endpoint to get current date and time
app.get('/datetime', (req, res) => {
    const now = new Date();
    res.json({ message: "Current Date and Time", datetime: now.toISOString() });
});

// Exporting the API
export const api = functions.https.onRequest(app);
