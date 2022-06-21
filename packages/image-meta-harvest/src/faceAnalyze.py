import os
import sys
import json

detector_name = "retinaface"

scandir = sys.argv[1]
print( scandir )

from deepface import DeepFace

for r, d, f in os.walk( scandir ):
    for file in f:
        if '.Faces.json' in file:
            facejson = r+'/'+file
            print (facejson)
            with open(facejson) as jsonfile:
                faces = json.load(jsonfile)
            print ('before')
            print (faces)    
            changed = False    
            for face in faces:
                if 'image' in face.keys() and 'faceAnalysis' not in face.keys() and face['face']['score'] >= .99:
                    print ('analyze image '+face['image'])
                    analysis = DeepFace.analyze(face['image'], ['age', 'gender', 'race', 'emotion'], enforce_detection=False, detector_backend=detector_name)
                    print(analysis)
                    face['faceAnalysis'] = analysis
                    changed = True
            if changed:
                print ('after')
                print (faces)
                with open(facejson, 'w') as jsonfile:
                    json.dump(faces, jsonfile)

