#
# Ubuntu Node.js Dockerfile
#
# https://github.com/dockerfile/ubuntu/blob/master/Dockerfile
# https://docs.docker.com/examples/nodejs_web_app/
#

# Pull base image.
FROM ubuntu:20.04
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
ENV DEBIAN_FRONTEND noninteractive
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 20.5.1

# Update and install essentials
RUN apt-get update
RUN apt-get -y dist-upgrade
RUN apt-get install -y curl

# Install Node.js
RUN mkdir -p /usr/local/nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Bundle app source
# Trouble with COPY http://stackoverflow.com/a/30405787/2926832
WORKDIR /bot-app
COPY . /bot-app

# Install app dependencies
RUN cd /bot-app && rm -rf node_modules package-lock.json && npm install

#  Defines your runtime(define default command)
# These commands unlike RUN (they are carried out in the construction of the container) are run when the container
CMD ["./node_modules/.bin/env-cmd", "-f", "prod.env", "node", "src/app.js"]
