from imageai.Detection import ObjectDetection
import os

execution_path = os.getcwd()

def print_result(detections):
    for eachObject in detections:
        print(eachObject["name"] , " : ", eachObject["percentage_probability"], " : ", eachObject["box_points"] )
        print("--------------------------------")

def process_image(detector, input_image_path, output_image_path):
    input_image = os.path.join(execution_path ,input_image_path)
    output_image_path=os.path.join(execution_path , output_image_path)
    detector.set_boxes_color((0, 0, 255))
    detections = detector.detectObjectsFromImage(input_image=input_image, 
        output_image_path=output_image_path, 
        minimum_percentage_probability=30)
    return detections

def get_retina_detector(model_path="worker/resnet.h5"):
    detector = ObjectDetection()
    detector.setModelTypeAsRetinaNet()
    detector.setModelPath( os.path.join(execution_path , model_path))
    detector.loadModel()
    return detector

detector = get_retina_detector()
detections = process_image(detector, "worker/test1.jpg", "worker/test1-result.jpg")
print_result(detections)
detections = process_image(detector, "worker/test2.jpg", "worker/test2-result.jpg")
print_result(detections)