FROM node

MAINTAINER Ramana Murthy Chavakula

ENV PORT=3000

COPY . /app

WORKDIR /app

RUN npm install

EXPOSE $PORT

ENTRYPOINT ["node", "app.js"]