FROM python:3.6-slim

RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y

# python dep
# RUN pip3 install --upgrade pip setuptools virtualenv

WORKDIR /usr/app/worker

# add pre-built tesnorflow2.4 wheel from remote or local
#ADD https://tf.novaal.de/westmere/tensorflow-2.4.0-cp36-cp36m-linux_x86_64.whl .
COPY ./tensorflow-2.4.0-cp36-cp36m-linux_x86_64.whl .

RUN pip3 install ./tensorflow-2.4.0-cp36-cp36m-linux_x86_64.whl
RUN pip3 install keras==2.4.3 numpy==1.19.3 pillow==7.0.0 scipy==1.4.1 \
 h5py==2.10.0 matplotlib==3.3.2 opencv-python keras-resnet==0.2.0

RUN pip3 install imageai --upgrade
RUN pip3 install pika
RUN pip3 install python-dotenv

COPY . .
# copy resnet.h5 model from remote or local
#ADD https://github.com/OlafenwaMoses/ImageAI/releases/download/essentials-v5/resnet50_coco_best_v2.1.0.h5 ObjectDetector/models/resnet.h5
#COPY /home/omer/Downloads/resnet.h5 ./ObjectDetector/models/resnet.h5

CMD ["python", "main.py"]