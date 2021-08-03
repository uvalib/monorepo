#
# build the target application
#
FROM node:16.1.0-buster-slim as builder

# update the packages
RUN apt update

WORKDIR /build
COPY . ./

# install dependancies
RUN npm install -g lerna

# build the deployable package
RUN lerna bootstrap
RUN lerna run build --scope=@uvalib/uvalib-catalog-light --stream

#
# build the target container
#
FROM alpine:3.13

# update the packages
RUN apk update && apk upgrade && apk add bash tzdata ca-certificates curl lighttpd && rm -rf /var/cache/apk/*

# Create the run user and group
RUN addgroup webservice && adduser webservice -G webservice -D

# set the timezone appropriatly
ENV TZ=UTC
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# port and run command
EXPOSE 80
CMD /home/webservice/entry.sh

# Move in necessary assets
COPY packages/uvalib-catalog-light/packaging/data/container_bash_profile /root/.profile
COPY packages/uvalib-catalog-light/packaging/conf/lighttpd.conf /etc/lighttpd/lighttpd.conf
COPY packages/uvalib-catalog-light/packaging/scripts/entry.sh /home/webservice/entry.sh
COPY --from=builder /build/packages/uvalib-catalog-light/dist/ /var/www/localhost/htdocs/

# Add the build tag
ARG BUILD_TAG
RUN test -n "$BUILD_TAG" && touch $APP_HOME/buildtag.build-$BUILD_TAG || touch $APP_HOME/buildtag.build-0

#
# end of file
#
