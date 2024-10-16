#!/bin/bash

set -e

# Define variables
DOCKER_IMAGE_NAME=goaccess-lambda-layer
DOCKERFILE_PATH=./Dockerfile.layer
OUTPUT_ZIP=goaccess_layer.zip
DIST_DIR=./dist

# Create dist directory if it doesn't exist
mkdir -p $DIST_DIR

# Build the Docker image
docker build -f $DOCKERFILE_PATH -t $DOCKER_IMAGE_NAME .

# Create a container from the image
CONTAINER_ID=$(docker create $DOCKER_IMAGE_NAME)

# Copy the Lambda layer ZIP from the container
docker cp $CONTAINER_ID:/build/$OUTPUT_ZIP $DIST_DIR/$OUTPUT_ZIP

# Remove the temporary container
docker rm $CONTAINER_ID

# Verify the goaccess.conf includes the geoip-database line
echo "Verifying goaccess.conf configuration..."
unzip -p $DIST_DIR/$OUTPUT_ZIP etc/goaccess/goaccess.conf | grep 'geoip-database /opt/etc/goaccess/GeoLiteCity.dat'

echo "Lambda layer ZIP created at $DIST_DIR/$OUTPUT_ZIP with flattened library paths and updated configuration."
