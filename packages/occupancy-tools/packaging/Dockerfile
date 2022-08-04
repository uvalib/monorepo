#
# build the target container
#

FROM public.ecr.aws/docker/library/node:16.16.0-buster-slim

# update the packages
RUN apt-get -y update && apt-get install -y iputils-ping curl traceroute procps

# set environment vars
ENV USER=webservice \
    GROUP=webservice \
    TZ="US/Eastern"

# Create the run user and group
RUN addgroup --quiet --gid 2000 $GROUP && \
    yes | adduser --quiet --uid 2000 --gid 2000 --disabled-login $USER

# set the timezone appropriatly
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Specify home 
ENV APP_HOME /occupancy-tools
WORKDIR $APP_HOME

# create necessary directories
RUN mkdir -p $APP_HOME/lib $APP_HOME/scripts

# Move in necessary assets
COPY packaging/scripts/entry.sh $APP_HOME/scripts/entry.sh
COPY package.json $APP_HOME
COPY lib/* $APP_HOME/lib/

# Update permissions
RUN chown -R $USER:$GROUP $APP_HOME

# become the user
USER $USER

# install dependancies
RUN npm install

# run command
CMD scripts/entry.sh

#
# end of file
#
