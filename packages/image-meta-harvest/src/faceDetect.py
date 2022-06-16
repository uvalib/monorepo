import os
from os.path import exists
import glob
import re
import sys

from PIL import Image
import requests
from io import BytesIO

import json
import face_recognition
import os
import os.path

scandir = sys.argv[1]
print( scandir )

for r, d, f in os.walk( scandir ):
    for file in f:
        if '.webp' in file:
            filepath = os.path.join(r, file)
            metafile = filepath.replace(".webp",".faces.json")
            if not os.path.isfile(metafile):
                image = face_recognition.load_image_file(filepath)
                face_locations = face_recognition.face_locations(image, number_of_times_to_upsample=0, model="cnn")
                print("found in "+filepath+":\n "+str(len(face_locations)))
                with open(metafile,'w') as outfile:
                    json.dump(face_locations, outfile)
                print("**********")