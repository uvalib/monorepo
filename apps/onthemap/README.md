Here is the rsync command that I used to get the html from the site:

rsync -zarv --include "*/" --include="*.html" --exclude="*"  static01.lib.virginia.edu:/lib_content47/static/exhibits/onthemap/media/ media

Here is the rsync command that I used to update the site:

rsync -zarvi media/  static01.lib.virginia.edu:/lib_content47/static/exhibits/onthemap/media

TODO: Finish getting this site from static, turn into 11ty build, find original map images (perhaps from Jon Loy's old hd), make zoomable compilation part of build and/or add images to Library iiif server, etc...