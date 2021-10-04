FROM node:16.10

ARG UNIFLOW_VERSION

RUN if [ -z "$UNIFLOW_VERSION" ] ; then echo "The UNIFLOW_VERSION argument is missing!" ; exit 1; fi

RUN \
	apt-get update && \
	apt-get -y install git

# Set a custom user to not have uniflow run as root
USER root

RUN npm_config_user=root npm install -g @uniflow-io/uniflow@${UNIFLOW_VERSION}

# fix and install dev dependancies
RUN npm_config_user=root npm install -g faker

WORKDIR /data

#COPY .env /usr/local/lib/node_modules/@uniflow-io/uniflow/.env.development
COPY .env .env.development
## quick path fix
RUN sed -i 's#./public#/usr/local/lib/node_modules/@uniflow-io/uniflow/public#g' /usr/local/lib/node_modules/@uniflow-io/uniflow/dist/loader/server-loader.js
RUN sed -i 's#./public#/usr/local/lib/node_modules/@uniflow-io/uniflow-client/public#g' /usr/local/lib/node_modules/@uniflow-io/uniflow-client/dist/uniflow-client/src/server.js

EXPOSE 8017/tcp
