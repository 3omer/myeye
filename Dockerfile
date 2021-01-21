FROM nikolaik/python-nodejs:python3.6-nodejs14-alpine

# nodejs dep
ADD /server/package.json /tmp/package.json
RUN cd /tmp && npm install --only=production
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app

WORKDIR /opt/app
ADD . /opt/app
EXPOSE $PORT

CMD [ "node",  "./server/app.js"]