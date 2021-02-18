FROM node:12-alpine

WORKDIR /usr/app/server
COPY package.json .
RUN npm install --quiet
COPY . .