# About
Practicing Async communication between services by bulding objects detection service using Node.js server, Python worker, and Rabbitmq as message broker.

## How it works
* User submit new image processing request to the API exposed by Node.js server
* The server push the request data to Rabbitmq queue. The data contains image URL.
* The python worker pull the data from the queue, download the image and run processig.
* The worker call server webhook to notify progress and also to upload the processed image.   

# How to run
## Docker
> docker-compose -f docker-copmose.dev.yml build

> docker-compose -f docker-compose.dev.yml up

## With out docker
### The server:

> cd ./server

> npm install

> npm run dev


### The worker:
> cd ./worker

> create and activate your venv

> pip install -r requirements.txt

> python main.py