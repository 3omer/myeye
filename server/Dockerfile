FROM node:12-alpine

# nodejs dep
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --only=production
RUN mkdir -p /opt/app/server && cp -a /tmp/node_modules /opt/app

WORKDIR /opt/app/server
ADD . .

EXPOSE $PORT
CMD ["node", "app.js"]
