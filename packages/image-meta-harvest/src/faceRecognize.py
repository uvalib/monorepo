import os
from os.path import exists
import sys
import json
from PIL import Image
import numpy as np

detector_name = "retinaface"

scandir = sys.argv[1]
print( scandir )

from deepface import DeepFace

face_db = "/Volumes/Addison_2018/Custom_Meta_People/"

print("check face database")
# ensure all the files are jpg format
for r, d, f in os.walk( face_db ):
    for file in f:
        file = r+'/'+file
        if '.webp' in file:
            jpgFile = file.replace('.webp','.jpg')
            if not exists(jpgFile):
                im = Image.open(file).convert("RGB")
                im.save(jpgFile, "jpeg")
                print ("Converted "+file+" to jpg!")

print("start looking at faces in "+scandir)
for r, d, f in os.walk( scandir ):
#    print(f)
    for file in f:
        print (file)
        if '.Faces.json' in file:
            facejson = r+'/'+file
            print (facejson)
            with open(facejson) as jsonfile:
                faces = json.load(jsonfile)
#            print ('before')
            print (len(faces))    
            changed = False    
            for face in faces:
#                print (face)
                if 'image' in face.keys() and 'faceRec' not in face.keys() and face['face']['score'] >= .99:
                    print("process")
                    faceimage = face['image'].replace('/Volumes/image-ml/Addison_2018/Volumes', '/Volumes/Addison_2018/Volumes')
                    fim = Image.open(faceimage)
                    width, height = fim.size
                    if width>500 and height>500:
                        print ('recognize image '+faceimage)
                        df = DeepFace.find(model_name = "Facenet512", distance_metric = "euclidean_l2", img_path = np.array(fim), db_path = face_db, enforce_detection=False, detector_backend=detector_name)
                        top = df.head().to_dict()
#                        print(top)
                        matches = {}
                        for key in top['identity']:
                            if top['Facenet512_euclidean_l2'][key]<.5:
                                #/Volumes/Addison_2018/Custom_Meta_People/EdAyers/911-542-1681-1566.aligned.jpg
                                ident = top['identity'][key].split('/')[4]
                                if ident in matches:
                                    matches[ ident ].append(top['Facenet512_euclidean_l2'][key])
                                else:
                                    matches[ ident ] = [ top['Facenet512_euclidean_l2'][key] ]
                        
                        if len(matches)>0:
                            print(matches)
                            face['faceRec'] = matches
                            changed = True
            if changed:
                print ('after')
                print (faces)
                print (facejson)
                print ("*****************************\n\n\n\n\n\n\n")
                with open(facejson, 'w') as jsonfile:
                    json.dump(faces, jsonfile)

