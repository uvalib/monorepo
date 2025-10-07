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

const SERIAL_NO_CONFIG = process.env.SERIAL_NO || 'ACCC8EF00E27';
const SERIAL_NUMBERS = Array.from(
  new Set(
    SERIAL_NO_CONFIG
      .split(',')
      .map((serial) => serial.trim())
      .filter(Boolean)
  )
);

if (SERIAL_NUMBERS.length === 0) {
  console.error('At least one SERIAL_NO must be provided via the environment.');
  process.exit(1);
}

const SOURCE_FILTER = process.env.SOURCE_FILTER || 'sum';

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


function groupRowsBySerial(rows) {
  return rows.reduce((map, row) => {
    const serial = row.serial_no;
    if (!map.has(serial)) {
      map.set(serial, []);
    }
    map.get(serial).push(row);
    return map;
  }, new Map());
}

function calculateOccupancyStats(rows) {
  let sum = 0;
  let count = 0;
  let max = { value: null, timestamp: null };
  let min = { value: null, timestamp: null };
  let finalOccupancy = null;

  for (const row of rows) {
    const occupancyValue = Number(row.occupancy);
    if (!Number.isFinite(occupancyValue)) {
      continue;
    }

    sum += occupancyValue;
    count += 1;

    if (max.value === null || occupancyValue > max.value) {
      max = { value: occupancyValue, timestamp: row.created_at };
    }

    if (min.value === null || occupancyValue < min.value) {
      min = { value: occupancyValue, timestamp: row.created_at };
    }

    finalOccupancy = occupancyValue;
  }

  const average = count > 0 ? sum / count : null;

  return {
    stats: {
      average,
      max: max.value === null ? null : max,
      min: min.value === null ? null : min,
      final: finalOccupancy
    },
    meta: {
      sum,
      count
    }
  };
}


function calculateResetAwareTotal(values) {
  let total = 0;
  let previous = null;

  for (const value of values) {
    if (!Number.isFinite(value)) {
      continue;
    }

    if (previous === null) {
      total += value;
      previous = value;
      continue;
    }

    if (value >= previous) {
      total += value - previous;
    } else {
      total += value;
    }

    previous = value;
  }

  return total;
}

function createEmptySummary() {
  return {
    recordCount: 0,
    totals: { countIn: 0, countOut: 0, netCount: 0 },
    occupancy: { average: null, max: null, min: null, final: null },
    occupancyMeta: { sum: 0, count: 0 },
    window: { start: null, end: null }
  };
}

function summarizeRows(rows) {
  const recordCount = rows.length;
  if (recordCount === 0) {
    return createEmptySummary();
  }

  const countInValues = [];
  const countOutValues = [];

  for (const row of rows) {
    const countIn = Number(row.count_in);
    if (Number.isFinite(countIn)) {
      countInValues.push(countIn);
    }

    const countOut = Number(row.count_out);
    if (Number.isFinite(countOut)) {
      countOutValues.push(countOut);
    }
  }

  const totalCountIn = calculateResetAwareTotal(countInValues);
  const totalCountOut = calculateResetAwareTotal(countOutValues);

  const firstReading = rows[0];
  const lastReading = rows[recordCount - 1];
  const { stats: occupancy, meta: occupancyMeta } = calculateOccupancyStats(rows);

  return {
    recordCount,
    totals: {
      countIn: totalCountIn,
      countOut: totalCountOut,
      netCount: totalCountIn - totalCountOut
    },
    occupancy,
    occupancyMeta,
    window: {
      start: firstReading.created_at,
      end: lastReading.created_at
    }
  };
}

function analyzeRows(rows) {
  const groups = groupRowsBySerial(rows);
  const serialSummaries = SERIAL_NUMBERS.map((serial) => {
    const serialRows = groups.get(serial) || [];
    return { serial, summary: summarizeRows(serialRows) };
  });

  const buildingSummary = buildBuildingSummary(serialSummaries);

  return {
    serialSummaries,
    buildingSummary
  };
}

function buildBuildingSummary(serialSummaries) {
  const aggregate = serialSummaries.reduce(
    (acc, { summary }) => {
      acc.recordCount += summary.recordCount;
      acc.totals.countIn += summary.totals.countIn;
      acc.totals.countOut += summary.totals.countOut;
      acc.totals.netCount += summary.totals.netCount;

      if (summary.window.start && (!acc.window.start || summary.window.start < acc.window.start)) {
        acc.window.start = summary.window.start;
      }

      if (summary.window.end && (!acc.window.end || summary.window.end > acc.window.end)) {
        acc.window.end = summary.window.end;
      }

      acc.occupancyMeta.sum += summary.occupancyMeta.sum;
      acc.occupancyMeta.count += summary.occupancyMeta.count;

      if (summary.occupancy.max && (!acc.occupancy.max || summary.occupancy.max.value > acc.occupancy.max.value)) {
        acc.occupancy.max = summary.occupancy.max;
      }

      if (summary.occupancy.min && (!acc.occupancy.min || summary.occupancy.min.value < acc.occupancy.min.value)) {
        acc.occupancy.min = summary.occupancy.min;
      }

      if (Number.isFinite(summary.occupancy.final)) {
        acc.occupancy.finalTotal += summary.occupancy.final;
        acc.occupancy.finalCount += 1;
      }

      return acc;
    },
    {
      recordCount: 0,
      totals: { countIn: 0, countOut: 0, netCount: 0 },
      occupancyMeta: { sum: 0, count: 0 },
      occupancy: { max: null, min: null, finalTotal: 0, finalCount: 0 },
      window: { start: null, end: null }
    }
  );

  const average = aggregate.occupancyMeta.count > 0
    ? aggregate.occupancyMeta.sum / aggregate.occupancyMeta.count
    : null;

  const final = aggregate.occupancy.finalCount > 0
    ? aggregate.occupancy.finalTotal
    : null;

  return {
    recordCount: aggregate.recordCount,
    totals: aggregate.totals,
    occupancy: {
      average,
      max: aggregate.occupancy.max,
      min: aggregate.occupancy.min,
      final
    },
    window: aggregate.window
  };
}

function printCameraSummary(serial, summary) {
  console.log(`  Serial ${serial}:`);

  if (summary.recordCount === 0) {
    console.log('    No rows for this serial in the requested period.');
    return;
  }

  console.log(`    Rows processed: ${summary.recordCount}`);
  console.log(`    Data window: ${formatFriendlyTimestamp(summary.window.start)} → ${formatFriendlyTimestamp(summary.window.end)}`);
  console.log(`    Total count_in: ${formatNumber(summary.totals.countIn)}`);
  console.log(`    Total count_out: ${formatNumber(summary.totals.countOut)}`);
  console.log(`    Net traffic: ${formatNumber(summary.totals.netCount)}`);

  const { occupancy } = summary;

  if (occupancy.average !== null) {
    console.log(`    Average occupancy: ${occupancy.average.toFixed(2)}`);
  } else {
    console.log('    Average occupancy: unavailable');
  }

  if (occupancy.max) {
    console.log(`    Peak occupancy: ${occupancy.max.value} at ${formatFriendlyTimestamp(occupancy.max.timestamp)}`);
  } else {
    console.log('    Peak occupancy: unavailable');
  }

  if (occupancy.min) {
    console.log(`    Lowest occupancy: ${occupancy.min.value} at ${formatFriendlyTimestamp(occupancy.min.timestamp)}`);
  } else {
    console.log('    Lowest occupancy: unavailable');
  }

  if (occupancy.final !== null) {
    console.log(`    Final reported occupancy: ${formatNumber(occupancy.final)}`);
  }
}

function printSummary(buildingSummary, serialSummaries, startDate, endDate) {
  console.log('\nOccupancy summary');
  console.log('------------------');
  console.log(`Requested window: ${startDate} → ${endDate}`);

  if (buildingSummary.recordCount === 0) {
    console.log('No occupancy rows found for the requested period.');
    return;
  }

  console.log(`Rows processed: ${buildingSummary.recordCount}`);
  console.log(`Data window: ${formatFriendlyTimestamp(buildingSummary.window.start)} → ${formatFriendlyTimestamp(buildingSummary.window.end)}`);

  console.log('\nCamera breakdown:');
  serialSummaries.forEach(({ serial, summary }) => {
    printCameraSummary(serial, summary);
  });

  const buildingTotals = buildingSummary.totals;
  console.log('\nBuilding totals across cameras:');
  console.log(`  Total count_in: ${formatNumber(buildingTotals.countIn)}`);
  console.log(`  Total count_out: ${formatNumber(buildingTotals.countOut)}`);
  console.log(`  Net traffic: ${formatNumber(buildingTotals.netCount)}`);

  const { occupancy } = buildingSummary;
  if (occupancy.average !== null || occupancy.max || occupancy.min || occupancy.final !== null) {
    console.log('  Occupancy overview:');
    if (occupancy.average !== null) {
      console.log(`    Average occupancy (all readings): ${occupancy.average.toFixed(2)}`);
    } else {
      console.log('    Average occupancy (all readings): unavailable');
    }

    if (occupancy.max) {
      console.log(`    Peak occupancy: ${occupancy.max.value} at ${formatFriendlyTimestamp(occupancy.max.timestamp)}`);
    }

    if (occupancy.min) {
      console.log(`    Lowest occupancy: ${occupancy.min.value} at ${formatFriendlyTimestamp(occupancy.min.timestamp)}`);
    }

    if (occupancy.final !== null) {
      console.log(`    Sum of final reported occupancy: ${formatNumber(occupancy.final)}`);
    }
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

    const serialPlaceholders = SERIAL_NUMBERS.map(() => '?').join(', ');
    const query = `
      SELECT id, source, serial_no, occupancy, count_in, count_out, source_unixtime, created_at
      FROM rawmetrics
      WHERE serial_no IN (${serialPlaceholders})
      AND source = ?
      AND created_at >= ? AND created_at <= ?
      ORDER BY serial_no ASC, created_at ASC;
    `;
    const startDatetime = `${startDateStr} 00:00:00`;
    const endDatetime = `${endDateStr} 23:59:59`;

    let buildingSummary = createEmptySummary();
    let serialSummaries = SERIAL_NUMBERS.map((serial) => ({ serial, summary: createEmptySummary() }));

    try {
      const params = [...SERIAL_NUMBERS, SOURCE_FILTER, startDatetime, endDatetime];
      const [rows] = await connection.execute(query, params);
      const analyzed = analyzeRows(rows);
      buildingSummary = analyzed.buildingSummary;
      serialSummaries = analyzed.serialSummaries;
    } catch (queryError) {
      spinner.stop('Processing interrupted.');
      throw queryError;
    }

    const completionMessage =
      buildingSummary.recordCount === 0
        ? 'No occupancy rows found for the requested period.'
        : `Processed ${buildingSummary.recordCount} occupancy rows across ${SERIAL_NUMBERS.length} camera(s).`;
    spinner.stop(completionMessage);

    printSummary(buildingSummary, serialSummaries, startDateStr, endDateStr);

  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    if (connection) await connection.end();
    rl.close();
  }
}

main();