# About
Practicing Async communication between services by bulding objects detection service using Node.js server, Python worker, and Rabbitmq as message broker.

## How it works
* User submit new image processing request to the API exposed by Node.js server
* The server push the request data to Rabbitmq queue. The data contains image URL.
* The python worker pull the data from the queue, download the image and run processig.
* The worker call server webhook to notify progress and also to upload the processed image.   