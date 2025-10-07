// Import required modules
import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';
import readline from 'node:readline';

import { createSpinner } from './spinner.js';
import { formatFriendlyTimestamp, formatNumber } from './formatters.js';

// Load environment variables from .env file
dotenv.config();

// Database connection details from .env
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const SERIAL_NO = process.env.SERIAL_NO || 'ACCC8EF00E27';  // Default if not in .env

// Function to validate date format (YYYY-MM-DD)
function validateDate(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    return false;
  }
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt user
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}


function calculateResetAwareTotal(values) {
  if (!values.length) return 0;

  let total = values[0];
  let previous = values[0];

  for (let index = 1; index < values.length; index += 1) {
    const current = values[index];
    if (!Number.isFinite(current)) {
      continue;
    }

    if (!Number.isFinite(previous)) {
      total += current;
      previous = current;
      continue;
    }

    if (current >= previous) {
      total += current - previous;
    } else {
      total += current;
    }

    previous = current;
  }

  return total;
}

function analyzeRows(rows) {
  const recordCount = rows.length;
  if (recordCount === 0) {
    return {
      recordCount,
      totals: { countIn: 0, countOut: 0, netCount: 0 },
      occupancy: { average: null, max: null, min: null, final: null },
      window: { start: null, end: null }
    };
  }

  const countInValues = [];
  const countOutValues = [];
  const occupancyStats = {
    sum: 0,
    count: 0,
    max: { value: null, timestamp: null },
    min: { value: null, timestamp: null },
    final: null
  };

  for (const row of rows) {
    const countIn = Number(row.count_in);
    if (Number.isFinite(countIn)) {
      countInValues.push(countIn);
    }

    const countOut = Number(row.count_out);
    if (Number.isFinite(countOut)) {
      countOutValues.push(countOut);
    }

    const occupancyValue = Number(row.occupancy);
    if (Number.isFinite(occupancyValue)) {
      occupancyStats.sum += occupancyValue;
      occupancyStats.count += 1;

      if (occupancyStats.max.value === null || occupancyValue > occupancyStats.max.value) {
        occupancyStats.max = { value: occupancyValue, timestamp: row.created_at };
      }

      if (occupancyStats.min.value === null || occupancyValue < occupancyStats.min.value) {
        occupancyStats.min = { value: occupancyValue, timestamp: row.created_at };
      }

      occupancyStats.final = occupancyValue;
    }
  }

  const totalCountIn = calculateResetAwareTotal(countInValues);
  const totalCountOut = calculateResetAwareTotal(countOutValues);
  const average = occupancyStats.count > 0 ? occupancyStats.sum / occupancyStats.count : null;

  const firstReading = rows[0];
  const lastReading = rows[recordCount - 1];

  return {
    recordCount,
    totals: {
      countIn: totalCountIn,
      countOut: totalCountOut,
      netCount: totalCountIn - totalCountOut
    },
    occupancy: {
      average,
      max: occupancyStats.max.value === null ? null : occupancyStats.max,
      min: occupancyStats.min.value === null ? null : occupancyStats.min,
      final: occupancyStats.final
    },
    window: {
      start: firstReading.created_at,
      end: lastReading.created_at
    }
  };
}

function printSummary(summary, startDate, endDate) {
  console.log('\nOccupancy summary');
  console.log('------------------');
  console.log(`Requested window: ${startDate} → ${endDate}`);

  if (summary.recordCount === 0) {
    console.log('No occupancy rows found for the requested period.');
    return;
  }

  const { totals, occupancy, window } = summary;

  console.log(`Rows processed: ${summary.recordCount}`);
  console.log(`Data window: ${formatFriendlyTimestamp(window.start)} → ${formatFriendlyTimestamp(window.end)}`);
  console.log(`Total count_in: ${formatNumber(totals.countIn)}`);
  console.log(`Total count_out: ${formatNumber(totals.countOut)}`);
  console.log(`Net traffic: ${formatNumber(totals.netCount)}`);

  if (occupancy.average !== null) {
    console.log(`Average occupancy: ${occupancy.average.toFixed(2)}`);
  } else {
    console.log('Average occupancy: unavailable');
  }

  if (occupancy.max) {
    console.log(`Peak occupancy: ${occupancy.max.value} at ${formatFriendlyTimestamp(occupancy.max.timestamp)}`);
  } else {
    console.log('Peak occupancy: unavailable');
  }

  if (occupancy.min) {
    console.log(`Lowest occupancy: ${occupancy.min.value} at ${formatFriendlyTimestamp(occupancy.min.timestamp)}`);
  } else {
    console.log('Lowest occupancy: unavailable');
  }

  if (occupancy.final !== null) {
    console.log(`Final reported occupancy: ${occupancy.final}`);
  }
}

async function main() {
  // Ask for start date
  let startDateStr = await prompt('Enter start date (YYYY-MM-DD): ');
  while (!validateDate(startDateStr)) {
    console.log('Invalid date format. Use YYYY-MM-DD.');
    startDateStr = await prompt('Enter start date (YYYY-MM-DD): ');
  }

  // Ask for end date
  let endDateStr = await prompt('Enter end date (YYYY-MM-DD): ');
  while (!validateDate(endDateStr)) {
    console.log('Invalid date format. Use YYYY-MM-DD.');
    endDateStr = await prompt('Enter end date (YYYY-MM-DD): ');
  }

  // Ensure start <= end
  if (new Date(startDateStr) > new Date(endDateStr)) {
    console.log('Start date must be before or equal to end date.');
    rl.close();
    process.exit(1);
  }

  // Connect to the database
  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME
    });
    console.log('Connected to database successfully.');

    const spinner = createSpinner('Processing occupancy data');

    const query = `
      SELECT id, source, serial_no, occupancy, count_in, count_out, source_unixtime, created_at
      FROM rawmetrics
      WHERE serial_no = ?
      AND source = ?
      AND created_at >= ? AND created_at <= ?
      ORDER BY created_at ASC;
    `;
    const startDatetime = `${startDateStr} 00:00:00`;
    const endDatetime = `${endDateStr} 23:59:59`;

    let summary;
    try {
      const [rows] = await connection.execute(query, [SERIAL_NO, 'occupancy', startDatetime, endDatetime]);
      summary = analyzeRows(rows);
    } catch (queryError) {
      spinner.stop('Processing interrupted.');
      throw queryError;
    }

    const completionMessage =
      summary.recordCount === 0
        ? 'No occupancy rows found for the requested period.'
        : `Processed ${summary.recordCount} occupancy rows.`;
    spinner.stop(completionMessage);

    printSummary(summary, startDateStr, endDateStr);

  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    if (connection) await connection.end();
    rl.close();
  }
}

main();