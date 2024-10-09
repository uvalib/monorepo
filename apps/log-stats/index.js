const { spawn } = require('child_process');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const zlib = require('zlib');
const path = require('path');
const fs = require('fs');

// Global exception handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

exports.handler = async (event) => {
  const sourceBucket = 'uvalib-cdn-logs';
  const destinationBucket = 'uvalib-cdn-reports';

  // Get the previous month and year
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth(); // 0-11, where 0 is January

  // Adjust for previous month
  let previousMonth = month - 1;
  let previousYear = year;
  if (previousMonth < 0) {
    previousMonth = 11; // December
    previousYear -= 1;
  }

  const monthStr = String(previousMonth + 1).padStart(2, '0'); // 1-based month
  const yearStr = String(previousYear);

  console.log(`Processing logs for ${yearStr}-${monthStr}`);

  // List all 'folders' (prefixes) in the source bucket
  const listParams = {
    Bucket: sourceBucket,
    Delimiter: '/',
  };

  let prefixes = [];
  try {
    const data = await s3.listObjectsV2(listParams).promise();
    prefixes = data.CommonPrefixes.map(prefix => prefix.Prefix);
  } catch (error) {
    console.error('Error listing prefixes:', error);
    throw error;
  }

  console.log('Found prefixes:', prefixes);

  // Limit the number of folders for testing
  prefixes = prefixes.slice(0, 1); // Process only the first folder for testing

  // Process each folder sequentially
  for (const prefix of prefixes) {
    console.log(`Processing folder: ${prefix}`);

    // List all log files in the folder for the previous month
    const logFiles = await getLogFilesForPreviousMonth(sourceBucket, prefix, previousYear, previousMonth + 1);

    if (logFiles.length === 0) {
      console.log(`No log files found for ${prefix} in ${yearStr}-${monthStr}`);
      continue;
    }

    console.log(`Found ${logFiles.length} log files for ${prefix}`);

    // Process the log files
    try {
      await processLogsForFolder(sourceBucket, prefix, logFiles, destinationBucket, yearStr, monthStr);
    } catch (error) {
      console.error(`Error processing logs for folder ${prefix}:`, error);
    }
  }

  return {
    statusCode: 200,
    body: 'Reports generated and uploaded successfully.',
  };
};

// Function to list log files for the previous month
async function getLogFilesForPreviousMonth(bucket, prefix, year, month) {
  const prefixParams = {
    Bucket: bucket,
    Prefix: prefix,
  };

  let continuationToken = null;
  let logFiles = [];

  do {
    const params = { ...prefixParams };
    if (continuationToken) {
      params.ContinuationToken = continuationToken;
    }

    const data = await s3.listObjectsV2(params).promise();

    for (const obj of data.Contents) {
      const key = obj.Key;
      const filename = path.basename(key);

      const regex = /\.(\d{4})-(\d{2})-(\d{2})-/;
      const match = filename.match(regex);
      if (match) {
        const fileYear = parseInt(match[1], 10);
        const fileMonth = parseInt(match[2], 10);

        if (fileYear === year && fileMonth === month) {
          logFiles.push(key);
        }
      }
    }

    continuationToken = data.IsTruncated ? data.NextContinuationToken : null;
  } while (continuationToken);

  return logFiles;
}

// Function to process logs for a folder with enhanced logging and error handling
async function processLogsForFolder(sourceBucket, prefix, logFiles, destinationBucket, yearStr, monthStr) {
  console.log(`Starting processing logs for folder: ${prefix}`);
  try {
    const folderName = prefix.replace('/', '');
    const tempDir = `/tmp/${folderName}`;
    const reportFileName = `${yearStr}-${monthStr}.html`;
    const reportFilePath = `${tempDir}/${reportFileName}`;

    // Ensure the temporary directory exists
    fs.mkdirSync(tempDir, { recursive: true });
    console.log(`Created temporary directory: ${tempDir}`);

    // Verify GoAccess binary exists
    const goaccessPath = '/opt/bin/goaccess';
    console.log(`GoAccess path: ${goaccessPath}`);
    if (!fs.existsSync(goaccessPath)) {
      throw new Error(`GoAccess binary not found at ${goaccessPath}`);
    }

    // Prepare GoAccess arguments
    const args = [
      '--config-file=/opt/etc/goaccess.conf',
      '--log-format=%d\\t%t\\t%^\\t%b\\t%h\\t%m\\t%v\\t%U\\t%s\\t%R\\t%u\\t%q\\t%^\\t%^\\t%^\\t%^\\t%H\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^',
      '--date-format=%Y-%m-%d',
      '--time-format=%H:%M:%S',
      `--output=${reportFilePath}`,
      '--real-os',
      '--agent-list',
      '--http-protocol=yes',
      '--process-and-exit',
      '--debug-file=/tmp/goaccess-debug.log',
      '-', // Tell GoAccess to read from stdin
    ];
    console.log(`GoAccess arguments: ${args.join(' ')}`);

    // Spawn GoAccess process
    const goaccessProcess = spawn(goaccessPath, args);
    console.log(`Spawned GoAccess process with PID: ${goaccessProcess.pid}`);

    // Handle GoAccess process events
    goaccessProcess.stdout.on('data', (data) => {
      console.log(`GoAccess stdout: ${data}`);
    });

    goaccessProcess.stderr.on('data', (data) => {
      console.error(`GoAccess stderr: ${data}`);
    });

    goaccessProcess.on('error', (error) => {
      console.error(`GoAccess process error:`, error);
    });

    goaccessProcess.stdin.on('error', (error) => {
      console.error(`GoAccess stdin error:`, error);
    });

    // Process each log file sequentially
    for (const key of logFiles.slice(0, 10)) { // Limit to 10 log files for testing
      console.log(`Processing log file: ${key}`);

      await new Promise((resolve, reject) => {
        const params = { Bucket: sourceBucket, Key: key };

        const s3Stream = s3.getObject(params).createReadStream();
        const gunzip = zlib.createGunzip();

        // Pipe the decompressed data into GoAccess stdin
        s3Stream.pipe(gunzip).pipe(goaccessProcess.stdin, { end: false });

        // Handle stream events
        s3Stream.on('end', () => {
          console.log(`Finished reading log file: ${key}`);
          resolve();
        });

        s3Stream.on('error', (error) => {
          console.error(`Error reading log file from S3: ${key}`, error);
          reject(error);
        });

        gunzip.on('error', (error) => {
          console.error(`Error decompressing log file: ${key}`, error);
          reject(error);
        });
      });
    }

    // Close GoAccess stdin to signal the end of input
    goaccessProcess.stdin.end();
    console.log(`Closed GoAccess stdin for folder: ${prefix}`);

    // Wait for GoAccess to finish processing
    await new Promise((resolve, reject) => {
      goaccessProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`GoAccess process completed successfully for folder: ${prefix}`);
          resolve();
        } else {
          console.error(`GoAccess exited with code ${code}`);
          // Read and log the debug file
          const debugFilePath = '/tmp/goaccess-debug.log';
          if (fs.existsSync(debugFilePath)) {
            const debugData = fs.readFileSync(debugFilePath, 'utf8');
            console.error('GoAccess debug log:', debugData);
          }
          reject(new Error(`GoAccess exited with code ${code}`));
        }
      });
    });

    // Upload the report to the destination S3 bucket
    console.log(`Uploading report to S3 for folder: ${prefix}`);
    const reportData = fs.readFileSync(reportFilePath);
    const destinationKey = `${folderName}/${reportFileName}`;
    const uploadParams = {
      Bucket: destinationBucket,
      Key: destinationKey,
      Body: reportData,
      ContentType: 'text/html',
    };

    await s3.putObject(uploadParams).promise();
    console.log(`Report uploaded to ${destinationBucket}/${destinationKey}`);

    // Clean up temporary files
    fs.unlinkSync(reportFilePath);
    fs.rmdirSync(tempDir, { recursive: true });
    console.log(`Cleaned up temporary files for folder: ${prefix}`);

  } catch (error) {
    console.error(`Error in processLogsForFolder for ${prefix}:`, error);
    throw error;
  }
}

