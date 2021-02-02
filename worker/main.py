import os
import pika
import json
import requests
from dotenv import load_dotenv
from ObjectDetector import RetinaObjectDetector

load_dotenv()
AMQP_URL = os.environ.get("AMQP_URL")

# where to save images before processing
INPUT_DIR = os.path.join(os.path.dirname(__file__), "input")
# where to save processed images
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")

if not os.path.isdir(INPUT_DIR):
    os.mkdir(INPUT_DIR)

if not os.path.isdir(OUTPUT_DIR):
    os.mkdir(OUTPUT_DIR)

def get_image(imageURL, filename):
    # filename = imageURL.split('/')[-1]
    image_path = os.path.join(INPUT_DIR, filename)
    image = requests.get(imageURL, stream=True).content

    with open(image_path, 'wb+') as handler:
        handler.write(image)

    return image_path

def upload_image(url, image_path):
    files = {'image': open(image_path, 'rb')}
    requests.put(url, files=files)

detector = RetinaObjectDetector()

def on_message(channel, method_frame, header_frame, body):
    print(method_frame.delivery_tag)

    payload = json.loads(body)
    download_url = payload["downloadFrom"]
    upload_url = payload["uploadTo"]
    filename = payload["filename"]

    input_path = get_image(download_url, filename)
    output_path = os.path.join(OUTPUT_DIR, filename)
    
    try:
        print("source img:", input_path, "output path:", output_path)
        detector.annotate_image(input_path, output_path)
        print('done')
        upload_image(upload_url, output_path)
        channel.basic_ack(delivery_tag=method_frame.delivery_tag)

    except Exception as e:
        channel.basic_nack(delivery_tag=method_frame.delivery_tag, requeue=True)
        print("image processing failed: - ", e)
    finally:
        pass


if __name__ == "__main__":
    
    if not AMQP_URL:
        raise ValueError("Ensure you defined AMQP_URL as env key")
    print(AMQP_URL[1:5])
    print("AMQP Connecting .. .")
    connection = pika.BlockingConnection(
        pika.connection.URLParameters(AMQP_URL)
        )

    channel = connection.channel()
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume('object_detection', on_message)
    print("AMQP is Connected")

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        channel.stop_consuming()
    connection.close()