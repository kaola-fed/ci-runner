#
# Dockerfile for Node environment
# Created at 03/22/2017
# Author: Cody Chan <int64ago@gmail.com>
#

FROM ubuntu:16.04


ARG NODE_VERSION=6.10.1

ENV NVM_DIR=/usr/local/nvm
ENV NVM_VERSION=v0.33.1


RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN sed -i 's/archive\.ubuntu\.com/mirrors\.163\.com/g' /etc/apt/sources.list
RUN apt-get update && apt-get install -y \
  git \
  curl

RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/${NVM_VERSION}/install.sh | bash

RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN npm config set registry https://registry.npm.taobao.org
RUN node -v
RUN npm -v

# RUN mkdir -p /root/.ssh
# ADD ./id_rsa /root/.ssh/id_rsa
# ADD ./id_rsa.pub /root/.ssh/id_rsa.pub
# ADD ./known_hosts /root/.ssh/known_hosts