import os
import pika
import json
from dotenv import load_dotenv
from ObjectDetector import RetinaObjectDetector

load_dotenv()
PUBLIC_DIR = os.environ.get("PUBLIC_DIR")
AMQP_URL = os.environ.get("AMQP_URL")

detector = RetinaObjectDetector()

def on_message(channel, method_frame, header_frame, body):
    print(method_frame.delivery_tag)
    print(body)
    payload = json.loads(body)
    img_src = payload["imageSrc"]
    print("source img:", img_src, "output dir:", PUBLIC_DIR)
    try:
        detector.anotate_image(img_src, PUBLIC_DIR)
        print('done')
    except Exception as e:
        print("image processing failed: - ", e)
    finally:
        channel.basic_ack(delivery_tag=method_frame.delivery_tag)


def test():
    input_image = os.getcwd() + "/worker/test2.jpg"
    output = "/home/omer/Desktop"
    RetinaObjectDetector().anotate_image(input_image, output)


if __name__ == "__main__":
    
    if AMQP_URL is None:
        raise ValueError("Make sure to define AMQP_URL env key")

    print("AMQP Connecting .. .")
    connection = pika.BlockingConnection(
        pika.connection.URLParameters(AMQP_URL)
        )

    channel = connection.channel()
    channel.basic_consume('tasks', on_message)
    print("AMQP is Connected")

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        channel.stop_consuming()
    connection.close()