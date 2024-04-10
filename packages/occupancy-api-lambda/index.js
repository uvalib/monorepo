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

const connection = mysql.createConnection(dbConfig);

exports.handler = async (event) => {
  const library = event.queryStringParameters.library;

  return new Promise((resolve, reject) => {
    const query = `
      SELECT total_in, total_out, occupancy
      FROM rawmetrics_occupancy
      WHERE serial_no IN (
        SELECT serial_no
        FROM cameras
        WHERE location_short = ?
      )
      ORDER BY id DESC
      LIMIT 10
    `;

    connection.query(query, [library], (error, results) => {
      if (error) {
        reject(new Error('Database query failed'));
      } else {
        resolve({
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(results[0] || {})
        });
      }
    });
  });
};
