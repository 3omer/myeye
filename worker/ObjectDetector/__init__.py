import os
import warnings
from uuid import uuid4
from imageai.Detection import ObjectDetection

execution_path = os.getcwd()

def get_abs_path(relative_path):
    return os.path.join(os.path.dirname(__file__), relative_path)

class RetinaObjectDetectore(ObjectDetection):
    
    _valid_ext = [".jpg", ".png", ] 

    def __init__(self, model_path="models/resnet.h5", anotation_color=(0, 0, 255)):
        super().__init__()
        self.setModelTypeAsRetinaNet()
        self.setModelPath(get_abs_path(model_path))
        self.loadModel()
        self.set_boxes_color(anotation_color)
    
    def anotate_image(self, input_path, output_dir, filename=None, filename_gen=None, min_prop=40):
        """
        :param input_path: absolute image path to read
        :param output_dir: output directory to save annotated image in
        :param filename: output image filename eg. 'report.jpg'
        :param name_gen: a function will be called to generate desired filename formats

        leave filename and filename_gen None to generate unique filenames everycall
        """
       
        if filename:
            name, ext = os.path.splitext(filename)
            if name == "" or ext == "":
                raise ValueError("param filename should be a valid filename with image extension. Your filename {}".format(filename))
        
        if not os.path.isdir(output_dir):
            raise ValueError("param output_dir should be a directory. You provided {}".format(output_dir))

        if filename and filename_gen:
            warnings.warn("Both filename and filename_gen are provided. filename_gen is omitted")
            filename_gen = None

        if filename_gen and not callable(filename_gen):
            raise ValueError("filename_gen should be a function. You passed {}".format(type(filename_gen)))
                
        if filename_gen:
            filename = filename_gen()

        if filename is None:
            filename = "result-" + uuid4().hex + ".jpg"

        output_path = os.path.join(output_dir, filename)

        return self.detectObjectsFromImage(input_image=input_path, 
                output_image_path=output_path,
                minimum_percentage_probability=min_prop)



def test():
    input_image = os.getcwd() + "/test2.jpg"
    output = "/home/omer/Desktop"
    RetinaObjectDetectore().anotate_image(input_image, output)
    

if __name__ == "__main__":

    # detector = get_retina_detector()
    # detections = process_image(detector, "worker/test1.jpg", "worker/test1-result.jpg")
    # print_result(detections)
    # detections = process_image(detector, "worker/test2.jpg", "worker/test2-result.jpg")
    # print_result(detections)
    print("its main")