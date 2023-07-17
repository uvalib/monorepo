const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const dockerArgs = ['run', '--rm', '-v', `${process.cwd()}:/data`, 'pandoc-debian'];

// Preprocess arguments
for (let i = 0; i < args.length; i++) {
    // Get absolute path to the file
    const absPath = path.join(process.cwd(), args[i]);

    // If this is the second argument (output file), create the output directory if it doesn't exist
    if (i === 1) {
        dockerArgs.push('-o'); // Add '-o' before output file
        const outputDir = path.dirname(absPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
    }

    // Add file argument, prefixed with /data/
    dockerArgs.push(`/data/${args[i]}`);
}

const pandoc = spawn('docker', dockerArgs);

pandoc.stdout.on('data', (data) => {
    console.log(`${data}`);
});

pandoc.stderr.on('data', (data) => {
    console.error(`${data}`);
});

pandoc.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
