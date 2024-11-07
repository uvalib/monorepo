const { spawn } = require('child_process');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const lambda = new AWS.Lambda();
const zlib = require('zlib');
const path = require('path');
const fs = require('fs');
const { PassThrough } = require('stream');


// Global exception handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

exports.handler = async (event, context) => {
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

  // Check if the function was invoked with a specific prefix
  if (event.prefix) {
    // Process the specific folder
    const prefix = event.prefix;
    console.log(`Processing folder: ${prefix}`);

    // List all log files in the folder for the previous month
    const logFiles = await getLogFilesForPreviousMonth(sourceBucket, prefix, previousYear, previousMonth + 1);

    if (logFiles.length === 0) {
      console.log(`No log files found for ${prefix} in ${yearStr}-${monthStr}`);
      return {
        statusCode: 200,
        body: `No log files found for ${prefix} in ${yearStr}-${monthStr}`,
      };
    }

    console.log(`Found ${logFiles.length} log files for ${prefix}`);

    // Process the log files
    try {
      await processLogsForFolder(sourceBucket, prefix, logFiles, destinationBucket, yearStr, monthStr, previousMonth, previousYear);
    } catch (error) {
      console.error(`Error processing logs for folder ${prefix}:`, error);
      throw error;
    }

    return {
      statusCode: 200,
      body: `Report generated and uploaded successfully for ${prefix}.`,
    };
  } else {
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

    // Invoke the function asynchronously for each prefix
    const functionName = context.functionName;
    const invokePromises = prefixes.map(async (prefix) => {
      const params = {
        FunctionName: functionName,
        InvocationType: 'Event', // Asynchronous invocation
        Payload: JSON.stringify({ prefix }),
      };

      try {
        const result = await lambda.invoke(params).promise();
        console.log(`Invoked Lambda for prefix ${prefix}:`, result);
      } catch (error) {
        console.error(`Error invoking Lambda for prefix ${prefix}:`, error);
      }
    });

    // Wait for all invocations to be sent
    await Promise.all(invokePromises);

    return {
      statusCode: 200,
      body: 'Reports generation initiated for all prefixes.',
    };
  }
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
async function processLogsForFolder(sourceBucket, prefix, logFiles, destinationBucket, yearStr, monthStr, previousMonth, previousYear) {
  console.log(`Starting processing logs for folder: ${prefix}`);
  try {
    const folderName = prefix.replace('/', '');
    const tempDir = `/tmp/${folderName}`;
    const reportFileName = `${yearStr}-${monthStr}.html`;
    const reportHtmlFilePath = `${tempDir}/${reportFileName}`;
    const reportJsonFilePath = `${tempDir}/${yearStr}-${monthStr}.json`;

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
      '--log-format=%d\\t%t\\t%^\\t%b\\t%h\\t%m\\t%v\\t%U\\t%s\\t%R\\t%u\\t%q\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%H\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^\\t%^',
      '--date-format=%Y-%m-%d',
      '--time-format=%H:%M:%S',
      '--anonymize-ip',
      `--output=${reportHtmlFilePath}`,
      `--output=${reportJsonFilePath}`,
      '--invalid-requests=/tmp/invalid-requests.log',
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
      combinedStream.destroy();
      activeStreams.forEach(stream => stream.destroy());
      throw error;
    });

    // Create a combined stream and increase its max listeners
    const combinedStream = new PassThrough();
    combinedStream.setMaxListeners(20);

    // Handle combined stream errors
    combinedStream.on('error', (error) => {
      console.error('Combined stream error:', error);
      goaccessProcess.kill();
      throw error;
    });

    // Pipe the combined stream into GoAccess stdin
    combinedStream.pipe(goaccessProcess.stdin);

    // Concurrency control variables
    const maxConcurrency = 10; // Adjust based on testing and Lambda resources
    let currentConcurrency = 0;
    let queue = [...logFiles]; // Clone the logFiles array
    let errored = false;
    let activeStreams = [];

    // Start processing log files
    processNext();

    // Wait for the combined stream to end
    await new Promise((resolve, reject) => {
      combinedStream.on('end', resolve);
      combinedStream.on('error', (error) => {
        console.error('Combined stream error:', error);
        reject(error);
      });
    });

    console.log(`Closed GoAccess stdin for folder: ${prefix}`);

    // Wait for GoAccess to finish processing
    await new Promise((resolve, reject) => {
      goaccessProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`GoAccess process completed successfully for folder: ${prefix}`);

          // Check if both report files exist
          if (!fs.existsSync(reportHtmlFilePath) || !fs.existsSync(reportJsonFilePath)) {
            console.error(`One or both report files not found at ${reportHtmlFilePath} and ${reportJsonFilePath}`);
            // Read and log the debug file
            const debugFilePath = '/tmp/goaccess-debug.log';
            if (fs.existsSync(debugFilePath)) {
              const debugData = fs.readFileSync(debugFilePath, 'utf8');
              console.error('GoAccess debug log:', debugData);
            }
            reject(new Error(`One or both report files not found at ${reportHtmlFilePath} and ${reportJsonFilePath}`));
            return;
          }

          // After GoAccess process completion
          const invalidRequestsPath = '/tmp/invalid-requests.log';
          if (fs.existsSync(invalidRequestsPath)) {
            const invalidRequestsData = fs.readFileSync(invalidRequestsPath, 'utf8');
            console.error('GoAccess invalid requests log:', invalidRequestsData);
          }

          resolve();
        } else {
          console.error(`GoAccess exited with code ${code}`);
          errored = true;
          goaccessProcess.kill();
          // Read and log the debug file
          const debugFilePath = '/tmp/goaccess-debug.log';
          if (fs.existsSync(debugFilePath)) {
            const debugData = fs.readFileSync(debugFilePath, 'utf8');
            console.error('GoAccess debug log:', debugData);
          }
          reject(new Error(`GoAccess exited with code ${code}`));
        }
      });

      goaccessProcess.on('error', (error) => {
        console.error(`GoAccess process error:`, error);
        reject(error);
      });
    });

    // Upload both reports to S3
    console.log(`Uploading reports to S3 for folder: ${prefix}`);

    // Upload the HTML report
    const htmlReportData = fs.readFileSync(reportHtmlFilePath);
    const htmlUploadParams = {
      Bucket: destinationBucket,
      Key: `${folderName}/${reportFileName}`, // Includes .html extension
      Body: htmlReportData,
      ContentType: 'text/html',
    };
    await s3.putObject(htmlUploadParams).promise();
    console.log(`HTML report uploaded to ${destinationBucket}/${htmlUploadParams.Key}`);

    // Upload the JSON report
    const jsonReportData = fs.readFileSync(reportJsonFilePath);
    const jsonUploadParams = {
      Bucket: destinationBucket,
      Key: `${folderName}/${yearStr}-${monthStr}.json`,
      Body: jsonReportData,
      ContentType: 'application/json',
    };
    await s3.putObject(jsonUploadParams).promise();
    console.log(`JSON report uploaded to ${destinationBucket}/${jsonUploadParams.Key}`);

    // Clean up temporary files
    fs.unlinkSync(reportHtmlFilePath);
    fs.unlinkSync(reportJsonFilePath);
    fs.rmdirSync(tempDir, { recursive: true });
    console.log(`Cleaned up temporary files for folder: ${prefix}`);
  } catch (error) {
    console.error(`Error in processLogsForFolder for ${prefix}:`, error);
    throw error;
  }

  // Inner functions
  function processNext() {
    if (errored) {
      console.log('Error detected, stopping further processing of log files.');
      return;
    }

    while (currentConcurrency < maxConcurrency && queue.length > 0) {
      const key = queue.shift();
      currentConcurrency++;
      console.log(`Processing log file: ${key}`);

      const params = { Bucket: sourceBucket, Key: key };
      const s3Stream = s3.getObject(params).createReadStream();
      const gunzip = zlib.createGunzip();

      // Keep track of active streams
      activeStreams.push(s3Stream);
      activeStreams.push(gunzip);

      // Pipe streams without ending the combinedStream
      s3Stream.pipe(gunzip).pipe(combinedStream, { end: false });

      const removeStream = (stream) => {
        const index = activeStreams.indexOf(stream);
        if (index !== -1) {
          activeStreams.splice(index, 1);
        }
      };

      const onComplete = () => {
        console.log(`Finished processing log file: ${key}`);
        currentConcurrency--;
        removeStream(s3Stream);
        removeStream(gunzip);

        if (errored) {
          console.log('Error detected during processing, not proceeding to next file.');
          return;
        }

        if (queue.length === 0 && currentConcurrency === 0) {
          combinedStream.end(); // Close the combinedStream when all files are processed
        } else {
          processNext(); // Continue processing the next files
        }
      };

      const onError = (error) => {
        console.error(`Error processing log file ${key}:`, error);
        errored = true;
        combinedStream.destroy();
        goaccessProcess.kill();
        activeStreams.forEach(stream => stream.destroy());
      };

      s3Stream.on('end', onComplete);
      s3Stream.on('error', onError);
      gunzip.on('error', onError);
    }
  }
}


