# TODO: worker functions
from ObjectDetector import RetinaObjectDetector

def test():
    input_image = os.getcwd() + "/worker/test2.jpg"
    output = "/home/omer/Desktop"
    RetinaObjectDetector().anotate_image(input_image, output)

if __name__ == "__main__":
    import os
    test()