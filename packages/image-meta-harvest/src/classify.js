const tf = require('@tensorflow/tfjs-node');
const argv = require('minimist')(process.argv.slice(2));
const mobilenet = require('@tensorflow-models/mobilenet');
const { readFileSync, writeFileSync, existsSync, mkdirSync, createWriteStream, fstat } = require('fs');
const { getFiles } = require('./shared.js');
const webp = require('webp-converter');

// Load the model.
var model;

async function getClassification(img, classFile) {
    await webp.dwebp(img, "/var/tmp/tmp.jpg","-o");
    const imageBuffer = readFileSync("/var/tmp/tmp.jpg");
    const tensor = tf.node.decodeImage(imageBuffer);
    // Classify the image
    const predictions = await model.classify(tensor);
    writeFileSync(classFile, JSON.stringify(predictions));
    console.log(`Class predictions for ${img}: `);
    console.log(predictions);
}

async function doit(){
    model = await mobilenet.load();

    console.log(`Get images from ${argv.in}`)
    for await(const f of getFiles(argv.in)) {
        if (f.mime.indexOf("image")>-1) {
            const classificationFile = f.file.replace('.webp', '.classify.json');
            if ( !await existsSync(classificationFile) ) {
                await getClassification(f.file, classificationFile);
            }
        }
    }

}

doit();