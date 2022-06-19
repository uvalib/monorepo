require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const cocoSsd = require('@tensorflow-models/coco-ssd');

const tf = require('@tensorflow/tfjs-node');
const argv = require('minimist')(process.argv.slice(2));

const { writeFileSync } = require('fs');
const { walkImageFiles, getImageBuffer } = require('./shared.js');

// Load the model.
var model;

async function getObjects(img, objectsFile) {

    const imageBuffer = await getImageBuffer(img, '/var/tmp/tmpobj.jpg');

    const tensor = tf.node.decodeImage(imageBuffer);
    // Objects from the image
    const predictions = await model.detect(tensor);
    writeFileSync(objectsFile, JSON.stringify(predictions));
    console.log(`Object predictions for ${img}: `);
    console.log(predictions);
}

async function doit(){
    model = await cocoSsd.load({base:"mobilenet_v2"});

    await walkImageFiles(argv, '.Objects.json', getObjects);

}

doit();