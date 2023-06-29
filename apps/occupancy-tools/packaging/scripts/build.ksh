if [ -z "$DOCKER_HOST" ]; then
   DOCKER_TOOL=docker
else
   DOCKER_TOOL=docker-legacy
fi

# set the definitions
INSTANCE=occupancy-service
NAMESPACE=uvadave

# build the image
$DOCKER_TOOL build -f packaging/Dockerfile -t $NAMESPACE/$INSTANCE .

# return status
exit $?
