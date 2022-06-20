const tf = require('@tensorflow/tfjs-node');
const argv = require('minimist')(process.argv.slice(2));
const mobilenet = require('@tensorflow-models/mobilenet');
const { writeFileSync } = require('fs');
const { walkImageFiles, getImageBuffer } = require('./shared.js');

// Load the model.
var model;

async function getClassification(img, classFile) {

    const imageBuffer = await getImageBuffer(img, '/var/tmp/tmp.jpg');

    const tensor = tf.node.decodeImage(imageBuffer);
    // Classify the image
    const predictions = await model.classify(tensor);
    writeFileSync(classFile, JSON.stringify(predictions));
    console.log(`Class predictions for ${img}: `);
    console.log(predictions);
}

async function doit(){
    model = await mobilenet.load();

    await walkImageFiles(argv.in, getClassification, '.Classify.json');

}

doit();