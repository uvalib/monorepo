require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const cocoSsd = require('@tensorflow-models/coco-ssd');

const tf = require('@tensorflow/tfjs-node');
const argv = require('minimist')(process.argv.slice(2));

const { readFileSync, writeFileSync, existsSync, unlinkSync } = require('fs');
const { getFiles } = require('./shared.js');
//const webp = require('webp-converter');
const sharp = require('sharp');

const jo = require('jpeg-autorotate')

// Load the model.
var model;

async function getObjects(img, objectsFile) {
//    await webp.dwebp(img, "/var/tmp/tmpobj.jpg","-o");
    await sharp(img).withMetadata().jpeg().toFile("/var/tmp/tmpobj.jpg");
    var imageBuffer;
    await jo.rotate("/var/tmp/tmpobj.jpg")
        .then(({buffer, orientation, dimensions, quality})=>{
            console.log("Image has been rotated!");
            imageBuffer = buffer;
        })
        .catch(()=>{
            console.log("Image didn't need to be rotated!");
            imageBuffer = readFileSync("/var/tmp/tmpobj.jpg");
        });
//    const imageBuffer = readFileSync("/var/tmp/tmpobj.jpg");
    const tensor = tf.node.decodeImage(imageBuffer);
    // Objects from the image
    const predictions = await model.detect(tensor);
    writeFileSync(objectsFile, JSON.stringify(predictions));
    console.log(`Object predictions for ${img}: `);
    console.log(predictions);
}

async function doit(){
    model = await cocoSsd.load({base:"mobilenet_v2"});

    console.log(`Get images from ${argv.in}`)
    for await(const f of getFiles(argv.in)) {
        if (f.mime.indexOf("image")>-1 && f.file.indexOf('_faces')<0 ) {
            const objectsFile = f.file.replace('.webp', '.Objects.json');
            if ( !await existsSync(objectsFile) ) {
                await getObjects(f.file, objectsFile);
            }
        }
    }

}

doit();