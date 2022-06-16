//require('@mediapipe/face_detection');
//require('@tensorflow/tfjs-core');
require('@tensorflow/tfjs-backend-webgl');

const faceDetection = require('@tensorflow-models/face-detection');

//require('@tensorflow/tfjs-backend-cpu');


const tf = require('@tensorflow/tfjs-node');
const argv = require('minimist')(process.argv.slice(2));

const { readFileSync, writeFileSync, existsSync } = require('fs');
const { getFiles } = require('./shared.js');
const webp = require('webp-converter');

// Load the model.
var model;

async function getFaces(img, facesFile) {
    await webp.dwebp(img, "/var/tmp/tmpobj.jpg","-o");
    const imageBuffer = readFileSync("/var/tmp/tmpobj.jpg");
    const tensor = tf.node.decodeImage(imageBuffer);
//console.log(tensor)    
    // Faces from the image
    const estimationConfig = {flipHorizontal: false};
    const faces = await detector.estimateFaces(tensor, estimationConfig);

    writeFileSync(facesFile, JSON.stringify(faces));
    console.log(`Face predictions for ${img}: `);
    console.log(faces);
}

async function doit(){
    model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    const detectorConfig = {
        runtime: 'tfjs',
        maxFaces: 25,
        modelType: 'full'
    };
    detector = await faceDetection.createDetector(model, detectorConfig);

    console.log(`Get images from ${argv.in}`)
    for await(const f of getFiles(argv.in)) {
        if (f.mime.indexOf("image")>-1) {
            const facesFile = f.file.replace('.webp', '.faces.json');
            if ( !await existsSync(facesFile) ) {
                await getFaces(f.file, facesFile);
            }
        }
    }

}

doit();