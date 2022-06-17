import os
from os.path import exists
import glob
import re
import sys

from PIL import Image
import requests
from io import BytesIO

import json
import os
import os.path

#import face_recognition
from PIL import Image
from deepface import DeepFace
from deepface.detectors import FaceDetector
import cv2
detector_name = "retinaface"
detector = FaceDetector.build_model(detector_name)

import image_to_numpy

scandir = sys.argv[1]
print( scandir )

import numpy as np

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

#def scantree(path):
#    """Recursively yield DirEntry objects for given directory."""
#    for entry in os.scandir(path):
#        if entry.is_dir(follow_symlinks=False):
#            yield from scantree(entry.path)  # see below for Python 2.x
#        else:
#            yield entry

for r, d, f in os.walk( scandir ):
    for file in f:
#for entry in scantree( scandir ):
#        file = entry.path
        print(file)
        if '.webp' in file:
            filepath = os.path.join(r, file)
            metafile = filepath.replace(".webp",".Faces.json")
            if not os.path.isfile(metafile):

                #image = face_recognition.load_image_file(filepath)
                #image = cv2.imread(filepath)
                image = image_to_numpy.load_image_file(filepath)

                #face_locations = face_recognition.face_locations(image, number_of_times_to_upsample=0, model="cnn")
                faces = FaceDetector.detect_faces(detector, detector_name, image, False)

                print("found in "+filepath+": "+str(len(faces)))

                face_locations = []
                face_directory = filepath.replace('.webp','_faces')               
                for face in faces:
                    face_img = Image.fromarray(face[0])
                    face_loc = face[1]

                    if not os.path.exists(face_directory):
                        os.makedirs(face_directory)
                    str_loc = [str(int) for int in face_loc]
                    faceimgpath = face_directory+'/'+'-'.join(str_loc)+'.webp'
                    face_img.save(faceimgpath)

                    analysis = DeepFace.analyze(faceimgpath, ['age', 'gender', 'race', 'emotion'], enforce_detection=False, detector_backend=detector_name)
                    print(analysis)

                    face_locations.append({
                            'faceLocation': face_loc,
                            'faceAnalysis': analysis,
                            'image': faceimgpath
                    })
                    

                with open(metafile,'w') as outfile:
                    json.dump(face_locations, outfile, cls=NpEncoder)
                print("**********")