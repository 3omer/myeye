import os
import pika
import json
from dotenv import load_dotenv
from ObjectDetector import RetinaObjectDetector

load_dotenv()

AMQP_URL = os.environ.get("AMQP_URL")
detector = RetinaObjectDetector()

def on_message(channel, method_frame, header_frame, body):
    print(method_frame.delivery_tag)

    payload = json.loads(body)
    try:
        input_path = payload["inputPath"]
        output_path = payload["outputPath"]
        print("source img:", input_path, "output path:", output_path)
        detector.annotate_image(input_path, output_path)
        print('done')
        channel.basic_ack(delivery_tag=method_frame.delivery_tag)

    except Exception as e:
        channel.basic_nack(delivery_tag=method_frame.delivery_tag, requeue=True)
        print("image processing failed: - ", e)
    finally:
        pass

def test(input_image, output_dir):
    input_image = input_image 
    output = output_dir
    detections = RetinaObjectDetector().anotate_image(input_image, output)
    print(detections)


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