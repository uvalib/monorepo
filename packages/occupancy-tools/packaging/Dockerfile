#
# build the target container
#
FROM node:16.1.0-buster-slim


# Specify home 
ENV APP_HOME /occupancy-tools
WORKDIR $APP_HOME

RUN mkdir -p $APP_HOME/lib $APP_HOME/scripts

# Move in necessary assets
COPY packaging/scripts/entry.sh $APP_HOME/scripts/entry.sh
COPY package.json $APP_HOME
COPY lib/* $APP_HOME/lib/

# install dependancies
RUN npm install

# run command
CMD scripts/entry.sh
