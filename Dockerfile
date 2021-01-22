FROM nikolaik/python-nodejs:python3.6-nodejs14-slim

RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y

# python dep
RUN pip3 install --upgrade pip setuptools virtualenv
ADD https://tf.novaal.de/westmere/tensorflow-2.4.0-cp36-cp36m-linux_x86_64.whl .
RUN pip3 install ./tensor*.whl
RUN pip3 install keras==2.4.3 numpy==1.19.3 pillow==7.0.0 scipy==1.4.1 h5py==2.10.0 matplotlib==3.3.2 opencv-python keras-resnet==0.2.0
RUN pip3 install imageai --upgrade
RUN pip3 install pika
RUN pip3 install python-dotenv

# nodejs dep
ADD /server/package.json /tmp/package.json
RUN cd /tmp && npm install --only=production
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app

WORKDIR /opt/app
ADD . /opt/app
WORKDIR /opt/app/worker/ObjectDetector/models
ADD https://github.com/OlafenwaMoses/ImageAI/releases/download/essentials-v5/resnet50_coco_best_v2.1.0.h5 resnet.h5

WORKDIR /opt/app
RUN mkdir -p server/public/downloads/ server/public/download/ server/upload 

RUN cd mkdir -p /opt/app/storage
ENV STORAGE=/opt/app/storage
EXPOSE $PORT
CMD [ "node",  "./server/app.js"]
