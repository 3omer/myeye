FROM nikolaik/python-nodejs:python3.6-nodejs14-slim

# python dep
RUN pip3 install --upgrade pip setuptools virtualenv
RUN pip3 install tensorflow==2.4.0
RUN pip3 install keras==2.4.3 numpy==1.19.3 pillow==7.0.0 scipy==1.4.1 h5py==2.10.0 matplotlib==3.3.2 opencv-python keras-resnet==0.2.0
RUN pip3 install imageai --upgrade
RUN pip3 install pika

# nodejs dep
ADD /server/package.json /tmp/package.json
RUN cd /tmp && npm install --only=production
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app

WORKDIR /opt/app
ADD . /opt/app
WORKDIR /opt/app/worker/models
ADD https://github.com/OlafenwaMoses/ImageAI/releases/download/essentials-v5/resnet50_coco_best_v2.1.0.h5 resnet.h5

WORKDIR /opt/app

EXPOSE $PORT
CMD [ "node",  "./server/app.js"]
