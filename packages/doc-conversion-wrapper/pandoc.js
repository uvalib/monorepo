const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let args = process.argv.slice(2);
let outputExtension;

// Check if --ext flag is provided and get its value
const extFlagIndex = args.findIndex(arg => arg === '--ext');
if (extFlagIndex !== -1 && args[extFlagIndex + 1]) {
    outputExtension = args[extFlagIndex + 1];
    args = args.filter((arg, index) => index !== extFlagIndex && index !== extFlagIndex + 1);
} else {
    console.error('Please provide --ext flag with the output extension');
    process.exit(1);
}

args.forEach((inputFile) => {
    // Prepare docker arguments
    const dockerArgs = ['run', '--rm', '-v', `${process.cwd()}:/data`, 'pandoc-debian'];

    // Define input and output file names
    const inputFileName = path.basename(inputFile);
    const outputFileName = path.basename(inputFile, path.extname(inputFile)) + '.' + outputExtension;

    // Create the output directory if it doesn't exist
    const outputDir = path.dirname(inputFile);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Add input and output file arguments, prefixed with /data/
    dockerArgs.push(`/data/${inputFileName}`, `-o`, `/data/${outputFileName}`);

    const pandoc = spawn('docker', dockerArgs);

    pandoc.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    pandoc.stderr.on('data', (data) => {
        console.error(`${data}`);
    });

    pandoc.on('close', (code) => {
        console.log(`Conversion of ${inputFile} exited with code ${code}`);
    });
});
