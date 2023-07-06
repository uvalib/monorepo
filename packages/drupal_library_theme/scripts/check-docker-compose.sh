#!/bin/bash

if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose could not be found."
    echo "Please install docker-compose by following the instructions at https://docs.docker.com/compose/install/"
    exit
fi

echo "docker-compose is installed."
