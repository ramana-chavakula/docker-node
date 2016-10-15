FROM node

MAINTAINER Ramana Murthy Chavakula

ENV PORT=3000
ENV isDocker=true

COPY . /app

WORKDIR /app

RUN npm install

EXPOSE $PORT

ENTRYPOINT ["node", "app.js"]