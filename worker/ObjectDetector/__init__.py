import os
import warnings
from uuid import uuid4
from imageai.Detection import ObjectDetection

execution_path = os.getcwd()

def get_abs_path(relative_path):
    return os.path.join(os.path.dirname(__file__), relative_path)


class RetinaObjectDetector(ObjectDetection):
    
    _valid_ext = [".jpg", ".png", ] 

    def __init__(self, model_path="models/resnet.h5", annotation_color=(0, 0, 255)):
        super().__init__()
        self.setModelTypeAsRetinaNet()
        self.setModelPath(get_abs_path(model_path))
        self.loadModel()
        #self.set_boxes_color(annotation_color)    
    
    
    def annotate_image(self, input_path, output_path, output_dir=None, filename=None, filename_gen=None, min_prop=51):
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

        if filename and filename_gen:
            warnings.warn("Both filename and filename_gen are provided. filename_gen is omitted")
            filename_gen = None

        if filename_gen and not callable(filename_gen):
            raise ValueError("filename_gen should be a function. You passed {}".format(type(filename_gen)))
                
        if filename_gen:
            filename = filename_gen()

        if filename is None:
            filename = "result-" + uuid4().hex + ".jpg"

        # Ive no idea what am i doing anymore propably gonna delete all this shit 
        # and just fuckin use abs pathes fgs 
        if not output_path:
            # output_path = os.path.join(output_dir, filename)
            pass

        print(output_path)
        
        return self.detectObjectsFromImage(input_image=input_path, 
                output_image_path=output_path,
                minimum_percentage_probability=min_prop)


if __name__ == "__main__":
    pass
