FROM node:8

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
RUN apt-get -y update && apt-get -y upgrade && apt-get -y install git

COPY . /usr/src/app/
RUN npm install --production
# RUN npm rebuild node-sass --force
# Build app
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3333

# start command
CMD [ "npm", "start" ]
