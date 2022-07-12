import fastdup
fastdup.run(input_dir="dupsearch.txt", work_dir='out')                            #main running function
#fastdup.create_duplicates_gallery('out/similarity.csv', save_path='.')       #create a visual gallery of found duplicates
#fastdup.create_outliers_gallery('out/outliers.csv',   save_path='.')       #create a visual gallery of anomalies
#fastdup.create_components_gallery('out', save_path='.') 