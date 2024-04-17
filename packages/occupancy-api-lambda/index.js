const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

// Configure your database connection using environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

// Lead cameras
const mainCameras = {
  'clemons': 'ACCC8EF00E27',
  'science': 'ACCC8EF6B105',
  'music': 'B8A44F4F1939',
  'finearts': 'B8A44F4F195D',
//  'shannon': 'ACCC8EF00E2D',
};

const connection = mysql.createConnection(dbConfig);

exports.handler = async (event) => {
  const library = event.queryStringParameters.library;

  return new Promise((resolve, reject) => {
    const query = `
    SELECT occupancy, total_in, total_out, date, time FROM rawmetrics_occupancy WHERE serial_no = ? ORDER BY date DESC, time DESC LIMIT 1;
    `;

    connection.query(query, [ mainCameras[library] ], (error, results) => {
      if (error) {
        reject(new Error('Database query failed'));
      } else {
        resolve({
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(results || {})
        });
      }
    });
  });
};
