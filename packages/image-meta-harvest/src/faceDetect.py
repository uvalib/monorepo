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
#from deepface import DeepFace
from deepface.detectors import FaceDetector
import cv2
detector_name = "retinaface"
detector = FaceDetector.build_model(detector_name)

import image_to_numpy

from retinaface import RetinaFace
from retinaface.commons import preprocess, postprocess

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

for r, d, f in os.walk( scandir ):
    for file in f:

        if '.webp' in file and '_faces' not in r:
            filepath = os.path.join(r, file)
            metafile = filepath.replace(".webp",".Faces.json")
            if not os.path.isfile(metafile):

                #image = face_recognition.load_image_file(filepath)
                #image = cv2.imread(filepath)
                print('open '+filepath)
                image = image_to_numpy.load_image_file(filepath)

                obj = RetinaFace.detect_faces(img_path = image)

                face_locations = []
                face_directory = filepath.replace('.webp','_faces') 

                if type(obj) == dict:
                    for key in obj:

                        face = obj[key]

                        facial_area = face["facial_area"]
                        facial_img = image[facial_area[1]: facial_area[3], facial_area[0]: facial_area[2]]
#                        analysis = {}
                        faceimgpath = ''
                        
                        # only bother getting img and analysis for faces above the threshold
                        if face['score'] >= .99:

                            if not os.path.exists(face_directory):
                                os.makedirs(face_directory)

                            landmarks = face["landmarks"]
                            left_eye = landmarks["left_eye"]
                            right_eye = landmarks["right_eye"]
                            nose = landmarks["nose"]
                            mouth_right = landmarks["mouth_right"]
                            mouth_left = landmarks["mouth_left"]

                            facial_img_aligned = postprocess.alignment_procedure(facial_img, right_eye, left_eye, nose)
                            facial_img_aligned = facial_img_aligned[:, :, ::-1]

                            str_loc = [str(int) for int in face["facial_area"] ]
                            faceimgpath = face_directory+'/'+'-'.join(str_loc)+'.webp'

                            Image.fromarray(facial_img).save(faceimgpath)
                            print("**** Saved image "+faceimgpath)
                            Image.fromarray(facial_img_aligned).save(faceimgpath.replace('.webp','.aligned.webp'))
                            print("---- Savedd aligned version")

#                            analysis = DeepFace.analyze(faceimgpath, ['age', 'gender', 'race', 'emotion'], enforce_detection=False, detector_backend=detector_name)

                        face_locations.append({
                                'face': face,
#                                'faceAnalysis': analysis,
                                'image': faceimgpath,
                                'imageAligned': faceimgpath.replace('.webp','.aligned.webp')
                        })

                with open(metafile,'w') as outfile:
                    json.dump(face_locations, outfile, cls=NpEncoder)
                    print("wrote meta to "+metafile)
                print("**********")                                              