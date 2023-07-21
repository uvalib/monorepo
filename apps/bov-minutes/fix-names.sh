#!/bin/bash

for file in bov_*.xml
do
    # Extract the date from the filename, remove any dashes
    date=$(echo $file | cut -d'_' -f2 | cut -d'.' -f1 | tr -d '-')

    # Check if date part is of the correct length
    if [ ${#date} -eq 8 ]; then
        # Format the date in yyyy-mm-dd
        formatted_date="${date:0:4}-${date:4:2}-${date:6:2}"

        # Rename the file
        mv -- "$file" "${formatted_date}.tei"
    else
        echo "Cannot rename $file: unexpected date format."
    fi
done
