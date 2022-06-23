import os
import sys
import traceback
import cv2
files = []

scandir = sys.argv[1]
print( scandir )

from annoy import AnnoyIndex
from deepface.basemodels import Facenet
from deepface.commons import functions
model = Facenet.loadModel()

files = []
for r, d, f in os.walk(scandir):
    if ('_faces' in r):
        for file in f:
            if ('.aligned' not in file and '.webp' in file):
                print ('found face image '+file)
                facepath = r+'/'+file
                print (facepath)
                files.append(facepath)
print('done collecting face files')

representations = []
count = 0
for img_path in files:
    try: 
        print('preproc image')    
        img = functions.preprocess_face(img=cv2.imread(img_path), detector_backend='retinaface', target_size=(160, 160),enforce_detection=False)
        print('vectorize image')
        embedding = model.predict(img)[0,:]
     
        representation = []
        representation.append(img_path)
        representation.append(embedding)
        representations.append(representation)

        count = count+1
        print(str(count))
    except Exception as e:
        print("couldn't process face in "+img_path)
        print(traceback.format_exc())
print ('have vector representations for '+str(len(representations))+'items')

embedding_size = 128 #FaceNet output size
t = AnnoyIndex(embedding_size, 'euclidean')
 
for i in range(0, len(representations)):
   representation = representations[i]
   img_path = representation[0]
   embedding = representation[1]
    
   t.add_item(i, embedding)
 
t.build(3) #3 trees
print ('we have and annoy index!')

#save the built model
t.save('result.ann')
